class SidebarController {
    constructor(
        $state,
        fixPhoneNumbers, fixEmailAddresses, fixAddresses
    ) {
        this.$state = $state;
        this.fixPhoneNumbers = fixPhoneNumbers;
        this.fixEmailAddresses = fixEmailAddresses;
        this.fixAddresses = fixAddresses;
    }
}

const Sidebar = {
    controller: SidebarController,
    template: require('./sidebar.html')
};

export default angular.module('mpdx.tools.fix.sidebar.component', [])
    .component('fixSidebar', Sidebar).name;
