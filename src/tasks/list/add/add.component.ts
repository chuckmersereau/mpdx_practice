import { startsWith } from 'lodash/fp';

class AddController {
    task: any;
    constructor(
        private $state: StateService,
        private contacts: ContactsService,
        private tasks: TasksService
    ) {
        this.$state = $state;
        this.contacts = contacts;
        this.tasks = tasks;
        this.task = {};
    }
    save() {
        const task = angular.copy(this.task);
        this.task = {};
        let contactsList = null;
        if (startsWith('contacts.show', this.$state.current.name)) {
            contactsList = [this.contacts.current.id];
        }
        this.tasks.create(task, contactsList);
    }
}

const Add = {
    controller: AddController,
    template: require('./add.html')
};

import contacts, { ContactsService } from '../../../contacts/contacts.service';
import tasks, { TasksService } from '../../tasks.service';
import uiRouter from '@uirouter/angularjs';
import { StateService } from '@uirouter/core';

export default angular.module('mpdx.tasks.list.add.component', [
    uiRouter,
    contacts, tasks
]).component('tasksListAdd', Add).name;
