class SidebarController {
    constructor(
        $state,
        contactFilter
    ) {
        this.$state = $state;
        this.contactFilter = contactFilter;
    }
    isInState(match) {
        return this.$state.$current.name.indexOf(match) === 0;
    }
}

const Sidebar = {
    template: require('./sidebar.html'),
    controller: SidebarController
};

export default angular.module('mpdx.contacts.sidebar.component', [])
    .component('contactsSidebar', Sidebar).name;