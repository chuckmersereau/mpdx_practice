class SidebarController {
    constructor(
        $state,
        fixAddresses, fixCommitmentInfo, fixEmailAddresses, fixPhoneNumbers
    ) {
        this.$state = $state;
        this.fixAddresses = fixAddresses;
        this.fixCommitmentInfo = fixCommitmentInfo;
        this.fixEmailAddresses = fixEmailAddresses;
        this.fixPhoneNumbers = fixPhoneNumbers;

        if (this.$state.current.name !== 'tools.fix.addresses') {
            this.fixAddresses.loadCount();
        }
        if (this.$state.current.name !== 'tools.fix.commitmentInfo') {
            this.fixCommitmentInfo.loadCount();
        }
        if (this.$state.current.name !== 'tools.fix.emailAddresses') {
            this.fixEmailAddresses.loadCount();
        }
        if (this.$state.current.name !== 'tools.fix.phoneNumbers') {
            this.fixPhoneNumbers.loadCount();
        }
    }
}

const Sidebar = {
    controller: SidebarController,
    template: require('./sidebar.html')
};

export default angular.module('mpdx.tools.fix.sidebar.component', [])
    .component('fixSidebar', Sidebar).name;
