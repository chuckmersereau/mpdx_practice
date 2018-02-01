import { contains, defaultTo, isEmpty, map, union } from 'lodash/fp';
import createPatch from 'common/fp/createPatch';

class CompleteTaskController {
    constructor(
        $log, $q, $scope,
        serverConstants, tasks, contacts,
        task
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$scope = $scope;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.contacts = contacts;

        this.task = angular.copy(task);
        /* istanbul ignore next */
        $log.debug('task to complete', this.task);
        this.taskInitialState = angular.copy(task);
        this.task.completed = true;
    }
    save() {
        return this.getPromise().then(() => {
            this.$scope.$hide();
            this.handleFollowUp();
        });
    }
    getPromise() {
        const taskPromise = this.createTask();
        const contactPromise = this.getContactPromise();
        return contactPromise ? this.$q.all([taskPromise, contactPromise]) : taskPromise;
    }
    createTask() {
        const patch = createPatch(this.taskInitialState, this.task);
        /* istanbul ignore next */
        this.$log.debug('task patch', patch);
        return this.tasks.save(patch, this.comment);
    }
    getContactPromise() {
        return (this.status && this.showPartnerStatus())
            ? this.contacts.bulkEditFields({ status: this.status }, this.task.contacts)
            : false;
    }
    handleFollowUp() {
        return this.task.next_action
            ? this.tasks.addModal({
                activityType: this.task.next_action,
                comments: union(defaultTo([], this.task.comments), defaultTo([], this.comment)),
                contactsList: map('id', this.task.contacts),
                task: this.task
            })
            : true;
    }
    showPartnerStatus() {
        return this.task.contacts
            && !isEmpty(this.task.contacts)
            && this.task.activity_type
            && !contains(this.task.activity_type, [
                'Pre Call Letter',
                'Reminder Letter',
                'Support Letter',
                'Thank',
                'To Do'
            ]);
    }
}

import contacts from 'contacts/contacts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.tasks.modals.complete.controller', [
    contacts, serverConstants, tasks
]).controller('completeTaskController', CompleteTaskController).name;
