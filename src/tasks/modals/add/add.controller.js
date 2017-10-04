import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import emptyToNull from 'common/fp/emptyToNull';
import get from 'lodash/fp/get';
import isNilOrEmpty from 'common/fp/isNilOrEmpty';
import isString from 'lodash/fp/isString';
import moment from 'moment';
import reduce from 'lodash/fp/reduce';
import startsWith from 'lodash/fp/startsWith';
import uuid from 'uuid/v1';
import union from 'lodash/fp/union';

class AddTaskController {
    constructor(
        $log, $rootScope, $scope, $state,
        contacts, serverConstants, tasks, tasksTags, users,
        contactsList, activityType, task, comments
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        /* istanbul ignore next */
        $log.debug('Add task params', {
            contactsList: contactsList,
            activityType: activityType,
            task: task,
            comments: comments
        });
        this.activate({ activityType: activityType, comments: comments, contactsList: contactsList, task: task });
    }
    activate({ activityType, comments, contactsList, task }) {
        const reuseTask = this.reuseTask(task, activityType);
        const useContacts = this.useContacts(task, reuseTask);
        const contactParams = useContacts ? angular.copy(contactsList) : [];
        const inContactView = startsWith('contacts.show', this.$state.current.name);
        this.contactsList = inContactView ? union(contactParams, [this.contacts.current.id]) : contactParams;
        this.task = reuseTask
            ? {
                activity_type: activityType,
                comments: this.mutateComments(comments),
                start_at: moment().add(2, 'd').toISOString(),
                subject: get('subject', task),
                tag_list: get('tag_list', task)
            }
            : { activity_type: activityType };
        /* istanbul ignore next */
        this.$log.debug('Add task mutated task', this.task);
        this.setDueDate = true;
        this.contactNames = null;

        return this.contacts.getNames(this.contactsList).then((data) => {
            this.contactNames = reduce((result, contact) => {
                result[contact.id] = contact.name;
                return result;
            }, {}, data);
        });
    }
    reuseTask(task, activityType) {
        return get('result', task) && activityType;
    }
    useContacts(task, reuseTask) {
        return isNilOrEmpty(task) || (task && reuseTask);
    }
    mutateComments(comments) {
        return emptyToNull(
            reduce((result, comment) => {
                const id = uuid();
                return isNilOrEmpty(comment)
                    ? result
                    : concat(result,
                        isString(comment)
                            ? {
                                id: id,
                                body: comment,
                                person: { id: this.users.current.id }
                            }
                            : assign(comment, { id: id })
                    );
            }, [], comments)
        );
    }
    addContact() {
        this.contactsList.push('');
    }
    setContact(params, index) {
        if (!params) {
            return;
        }
        this.contactNames[params.id] = params.name; // set id if missing or out of date
        this.contactsList[index] = params.id;
    }
    save() {
        this.task.start_at = this.setDueDate ? this.task.start_at : null;
        return this.tasks.create(
            this.task,
            this.contactsList,
            this.comment
        ).then(() => {
            this.$rootScope.$emit('taskAdded');
            this.$scope.$hide();
        });
    }
}

import contacts from 'contacts/contacts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from '../../tasks.service';

export default angular.module('mpdx.tasks.modals.add.controller', [
    contacts, serverConstants, tasks
]).controller('addTaskController', AddTaskController).name;
