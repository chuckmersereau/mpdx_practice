import { concat, contains, get, map, reduce } from 'lodash/fp';
import moment from 'moment';

class LogTaskController {
    constructor(
        $q, $rootScope, $scope,
        contacts, serverConstants, tasks, tasksTags,
        contactsList
    ) {
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;

        this.task = {
            completed: true,
            completed_at: moment().toISOString()
        };
        this.contactsList = contactsList;
    }
    save() {
        return this.getPromise().then(() => {
            let task = angular.copy(this.task);
            this.$scope.$hide();
            if (get('next_action', task)) {
                task.subject = task.next_action === task.activity_type ? task.subject : null;
                this.tasks.addModal({
                    activityType: task.next_action,
                    comments: [this.comment],
                    contactsList: map('id', this.contactsList),
                    task: task
                });
            } else {
                this.$rootScope.$emit('taskLogged');
            }
        });
    }
    getPromise() {
        const taskPromise = this.createTask();
        const contactPromise = this.getContactPromise();
        return contactPromise ? this.$q.all([taskPromise, contactPromise]) : taskPromise;
    }
    createTask() {
        const contactIdList = map('id', this.contactsList);
        return this.tasks.create(this.task, contactIdList, this.comment);
    }
    getContactPromise() {
        const contactIdList = map('id', this.contactsList);
        return (this.status && this.showPartnerStatus())
            ? this.contacts.bulkSave(reduce((result, contact) =>
                concat(result, { id: contact, status: this.status })
                , [], contactIdList))
            : false;
    }
    showPartnerStatus() {
        return this.contactsList.length > 0
            && this.task.activity_type
            && !contains(
                this.task.activity_type,
                ['Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do']
            );
    }
    activityChanged() {
        this.task.result = get('[0]', this.serverConstants.data.results[this.task.activity_type.toLowerCase()]);
    }
}

import contacts from 'contacts/contacts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from '../../tasks.service';

export default angular.module('mpdx.contacts.logTask.controller', [
    contacts, serverConstants, tasks
]).controller('logTaskController', LogTaskController).name;
