class ToolsController {
    dropdown: boolean;
    setup: boolean;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private $stateParams: StateParams,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private help: HelpService,
        private session: SessionService,
        private tools: ToolsService,
        private users: UsersService
    ) {
        this.setup = $stateParams.setup;
        this.dropdown = false;
    }
    $onInit() {
        this.help.suggest([
            this.gettextCatalog.getString('5845aa229033600698176a54'),
            this.gettextCatalog.getString('584715b890336006981774d2'),
            this.gettextCatalog.getString('5845a6de9033600698176a43'),
            this.gettextCatalog.getString('58496d4ec6979106d373bb57'),
            this.gettextCatalog.getString('58496e389033600698178180'),
            this.gettextCatalog.getString('58a47007dd8c8e56bfa7b7a4')
        ]);

        this.session.navSecondary = true;

        this.$rootScope.$on('accountListUpdated', () => {
            this.tools.getAnalytics(true);
        });

        this.tools.getAnalytics();
    }
    $onDestroy() {
        this.session.navSecondary = false;
    }
}

const Tools = {
    controller: ToolsController,
    template: require('./tools.html')
};

import 'angular-gettext';
import { StateParams, StateService } from '@uirouter/core';
import uiRouter from '@uirouter/angularjs';
import help, { HelpService } from '../common/help/help.service';
import session, { SessionService } from '../common/session/session.service';
import tools, { ToolsService } from './tools.service';
import users, { UsersService } from '../common/users/users.service';

export default angular.module('mpdx.tools.component', [
    'gettext', uiRouter,
    help, session, tools, users
]).component('tools', Tools).name;
