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
    }

    $onInit() {
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

import uiRouter from '@uirouter/angularjs';
import fixAddresses from '../addresses/addresses.service';
import fixCommitmentInfo from '../commitmentInfo/commitmentInfo.service';
import fixEmailAddresses from '../emailAddresses/emailAddresses.service';
import fixPhoneNumbers from '../phoneNumbers/phoneNumbers.service';

export default angular.module('mpdx.tools.fix.sidebar.component', [
    uiRouter,
    fixAddresses, fixCommitmentInfo, fixEmailAddresses, fixPhoneNumbers
]).component('fixSidebar', Sidebar).name;
