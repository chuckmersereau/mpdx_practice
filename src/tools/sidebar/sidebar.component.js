class SidebarController {
    constructor(
        $rootScope,
        $state,
        tools
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.tools = tools;
    }
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
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.sidebar.component', [
    uiRouter,
    tools
]).component('toolsSidebar', Sidebar).name;
