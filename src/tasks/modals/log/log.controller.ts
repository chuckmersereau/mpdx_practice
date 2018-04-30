import { concat, contains, get, map, reduce } from 'lodash/fp';
import * as moment from 'moment';

class LogTaskController {
    comment: any; // addModal type issue w/ string
    status: string;
    task: any;
    constructor(
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private contacts: ContactsService,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService,
        private tasksTags: TasksTagsService,
        private contactsList: any[]
    ) {
        this.task = {
            completed: true,
            completed_at: moment().toISOString()
        };
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

import contacts, { ContactsService } from '../../../contacts/contacts.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tasks, { TasksService } from '../../tasks.service';
import { TasksTagsService } from '../../filter/tags/tags.service';

export default angular.module('mpdx.contacts.logTask.controller', [
    contacts, serverConstants, tasks
]).controller('logTaskController', LogTaskController).name;
