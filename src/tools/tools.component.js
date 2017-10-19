class ToolsController {
    constructor(
        $rootScope,
        $state, $stateParams, gettextCatalog,
        help, session, tools
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;
        this.help = help;
        this.session = session;
        this.tools = tools;
        this.setup = $stateParams.setup;
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

import gettextCatalog from 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import help from 'common/help/help.service';
import session from 'common/session/session.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.component', [
    gettextCatalog, uiRouter,
    help, session, tools
]).component('tools', Tools).name;
