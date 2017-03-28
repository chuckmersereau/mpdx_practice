import moment from 'moment';

class ListController {
    alerts;
    modal;
    moment;
    tasks;
    users;

    constructor(
        gettextCatalog,
        alerts, contacts, modal, tasks, tasksModals, users
    ) {
        this.alerts = alerts;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.moment = moment;
        this.tasks = tasks;
        this.tasksModals = tasksModals;
        this.users = users;

        this.models = {};
    }
}

const Tasks = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.tasks.list.component', [])
    .component('tasksList', Tasks).name;
