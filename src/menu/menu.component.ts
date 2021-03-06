import { StateService } from '@uirouter/core';
import config from '../config';
import contacts, { ContactsService } from '../contacts/contacts.service';
import donations, { DonationsService } from '../reports/donations/donations.service';
import help, { HelpService } from '../common/help/help.service';
import session, { SessionService } from '../common/session/session.service';
import tasks, { TasksService } from '../tasks/tasks.service';
import tools, { ToolsService } from '../tools/tools.service';
import uiRouter from '@uirouter/angularjs';
import users, { UsersService } from '../common/users/users.service';

class MenuController {
    setup: boolean;
    sidekiqUrl: string;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        private $state: StateService,
        private contacts: ContactsService,
        private donations: DonationsService,
        private help: HelpService,
        private session: SessionService,
        private tasks: TasksService,
        private tools: ToolsService,
        private users: UsersService
    ) {
        this.sidekiqUrl = `${config.oAuthUrl}sidekiq?access_token=${this.$window.localStorage.getItem('token')}`;
    }
    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.tools.getAnalytics(true);
        });

        if (!this.setup) {
            this.tools.getAnalytics();
        }
    }
}

const menuComponent = {
    controller: MenuController,
    template: require('./menu.html'),
    bindings: {
        setup: '<'
    }
};

// use help mock in test
export default angular.module('mpdx.menu.component', [
    uiRouter,
    contacts, donations, help, session, tasks, tools, users
]).component('menu', menuComponent).name;
