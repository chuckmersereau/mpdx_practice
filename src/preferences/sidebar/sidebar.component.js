class SidebarController {
}

const Sidebar = {
    controller: SidebarController,
    template: require('./sidebar.html')
};

export default angular.module('mpdx.preferences.sidebar.component', [])
    .component('preferencesSidebar', Sidebar).name;

