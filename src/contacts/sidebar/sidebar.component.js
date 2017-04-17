class SidebarController {
    constructor(
        contactFilter, session
    ) {
        this.session = session;
        this.contactFilter = contactFilter;
    }
}

const Sidebar = {
    template: require('./sidebar.html'),
    controller: SidebarController
};

export default angular.module('mpdx.contacts.sidebar.component', [])
    .component('contactsSidebar', Sidebar).name;