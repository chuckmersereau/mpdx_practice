import { StateService } from '@uirouter/core';

class SidebarController {
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private tools: ToolsService
    ) {}
    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.tools.getAnalytics(true);
        });
        this.tools.getAnalytics();
    }
}

const Sidebar = {
    controller: SidebarController,
    template: require('./sidebar.html')
};

import uiRouter from '@uirouter/angularjs';
import tools, { ToolsService } from '../tools.service';

export default angular.module('mpdx.tools.sidebar.component', [
    uiRouter,
    tools
]).component('toolsSidebar', Sidebar).name;
