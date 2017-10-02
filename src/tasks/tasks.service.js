import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import assign from 'lodash/fp/assign';
import isEmpty from 'lodash/fp/isEmpty';
import isNilOrEmpty from 'common/fp/isNilOrEmpty';
import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';
import joinComma from 'common/fp/joinComma';
import reduce from 'lodash/fp/reduce';
import uuid from 'uuid/v1';

class TasksService {
    constructor(
        $rootScope, $log, gettextCatalog,
        api, modal, serverConstants, tasksModals, tasksTags, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasksModals = tasksModals;
        this.tasksTags = tasksTags;
        this.users = users;

        this.analytics = null;
        this.completeList = [];
        this.loading = true; // TODO: maybe should become false until actually loading
    }
    getAnalytics() {
        return this.api.get('tasks/analytics', { filter: { account_list_id: this.api.account_list_id } }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('tasks/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    save(task, comment = null) {
        task = this.mutateTagList(task);
        task = this.mutateComment(task, comment);

        return this.api.put(`tasks/${task.id}`, task).then(() => {
            this.change();
        });
    }
    mutateTagList(task) {
        // fix for api mis-match
        return task.tag_list ? assign(task, {
            tag_list: joinComma(task.tag_list)
        }) : task;
    }
    mutateComment(task, comment) {
        return !isNilOrEmpty(comment) ? assign(task, {
            comments: concat(defaultTo([], task.comments), {
                id: uuid(),
                body: comment,
                person: { id: this.users.current.id }
            })
        }) : task;
    }
    change() {
        this.$rootScope.$emit('taskChange');
    }
    create(task, contactIds = [], comment) {
        task.account_list = { id: this.api.account_list_id };
        contactIds = reject('', contactIds);
        task = this.mutateTagList(task);
        if (contactIds.length > 1) {
            const tasks = reduce((result, contactId) => {
                let contactTask = angular.copy(task);
                contactTask = this.mutateComment(contactTask, comment);
                if (!isEmpty(contactId)) {
                    result = concat(result, assign(contactTask, { id: uuid(), contacts: [{ id: contactId }] }));
                }
                return result;
            }, [], contactIds);
            return this.api.post({ url: 'tasks/bulk', data: tasks, type: 'tasks' }).then(() => {
                if (contactIds.length > 0) {
                    this.$rootScope.$emit('contactCreated');
                }
            });
        }
        task = this.mutateComment(task, comment);

        task.contacts = map((contactId) => { return { id: contactId }; }, contactIds);
        return this.api.post('tasks', task).then((data) => {
            this.$rootScope.$emit('taskCreated', task);
            return data;
        });
    }
    delete(task) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected task?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`tasks/${task.id}`).then(() => {
                this.$rootScope.$emit('taskDeleted', task.id);
            });
        });
    }
    addModal({ contactsList = [], activityType = null, task = {}, comments = [] }) {
        return this.modal.open({
            template: require('./modals/add/add.html'),
            controller: 'addTaskController',
            resolve: {
                tags: () => this.tasksTags.load(),
                0: () => this.serverConstants.load(['activity_hashes'])
            },
            locals: {
                activityType: activityType,
                comments: comments,
                contactsList: contactsList,
                task: task
            }
        });
    }
    logModal(contactsList = []) {
        return this.modal.open({
            template: require('./modals/log/log.html'),
            controller: 'logTaskController',
            resolve: {
                tags: () => this.tasksTags.load(),
                0: () => this.serverConstants.load(['activity_hashes', 'next_actions', 'results', 'status_hashes'])
            },
            locals: {
                contactsList: contactsList
            }
        });
    }
}

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import getText from 'angular-gettext';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasksModals from './modals/modals.service';
import tasksTags from './filter/tags/tags.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.tasks.service', [
    getText,
    api, contacts, serverConstants, tasksModals, tasksTags, users
]).service('tasks', TasksService).name;
