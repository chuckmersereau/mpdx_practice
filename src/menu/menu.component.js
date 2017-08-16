class menuController {
    constructor(
        $rootScope,
        $state,
        contacts, donations, help, session, tasks, tools, users
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.contacts = contacts;
        this.donations = donations;
        this.help = help;
        this.session = session;
        this.tasks = tasks;
        this.tools = tools;
        this.users = users;
    }

    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.tools.getAnalytics(true);
        });

        this.tools.getAnalytics();
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html'),
    bindings: {
        setup: '<'
    }
};

import uiRouter from '@uirouter/angularjs';
import contacts from 'contacts/contacts.service';
import donations from 'reports/donations/donations.service';
import help from 'common/help/help.service';
import session from 'common/session/session.service';
import tasks from 'tasks/tasks.service';
import tools from 'tools/tools.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.menu.component', [
    uiRouter,
    contacts, donations, help, session, tasks, tools, users
]).component('menu', menuComponent).name;
