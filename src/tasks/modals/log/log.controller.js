import concat from 'lodash/fp/concat';
import contains from 'lodash/fp/contains';
import get from 'lodash/fp/get';
import reduce from 'lodash/fp/reduce';

class LogTaskController {
    constructor(
        $q, $rootScope, $scope, $state,
        contacts, serverConstants, tasks, tasksTags, users,
        contactsList
    ) {
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.tasksTags = tasksTags;
        this.tasks = tasks;
        this.users = users;

        this.task = { completed: true };
        this.contactsList = contactsList;
    }
    save() {
        return this.getPromise().then(() => {
            this.$scope.$hide();
            if (get('next_action', this.task)) {
                this.tasks.addModal({
                    activityType: this.task.next_action,
                    comments: [this.comment],
                    contactsList: this.contactsList,
                    task: this.task
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
        return this.tasks.create(this.task, this.contactsList, this.comment);
    }
    getContactPromise() {
        return (this.status && this.showPartnerStatus())
            ? this.contacts.bulkSave(reduce((result, contact) =>
                concat(result, { id: contact, status: this.status })
                , [], this.contactsList))
            : false;
    }
    showPartnerStatus() {
        return this.contactsList.length > 0 && this.task.activity_type && !contains(this.task.activity_type, ['Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do']);
    }
}

import contacts from 'contacts/contacts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from '../../tasks.service';

export default angular.module('mpdx.contacts.logTask.controller', [
    contacts, serverConstants, tasks
]).controller('logTaskController', LogTaskController).name;
