import startsWith from 'lodash/fp/startsWith';

class AddController {
    constructor(
        $state,
        contacts, tasks
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

import contacts from 'contacts/contacts.service';
import tasks from 'tasks/tasks.service';
import uiRouter from 'angular-ui-router';

export default angular.module('mpdx.tasks.list.add.component', [
    uiRouter,
    contacts, tasks
]).component('tasksListAdd', Add).name;
