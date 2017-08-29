class SidebarController {
    constructor(
        $rootScope,
        $state,
        fixAddresses, fixCommitmentInfo, fixEmailAddresses, fixPhoneNumbers, fixSendNewsletter, tools
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.fixAddresses = fixAddresses;
        this.fixCommitmentInfo = fixCommitmentInfo;
        this.fixEmailAddresses = fixEmailAddresses;
        this.fixPhoneNumbers = fixPhoneNumbers;
        this.fixSendNewsletter = fixSendNewsletter;
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
import fixAddresses from '../addresses/addresses.service';
import fixCommitmentInfo from '../commitmentInfo/commitmentInfo.service';
import fixEmailAddresses from '../emailAddresses/emailAddresses.service';
import fixPhoneNumbers from '../phoneNumbers/phoneNumbers.service';
import fixSendNewsletter from '../sendNewsletter/sendNewsletter.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.fix.sidebar.component', [
    uiRouter,
    fixAddresses, fixCommitmentInfo, fixEmailAddresses, fixPhoneNumbers, fixSendNewsletter, tools
]).component('fixSidebar', Sidebar).name;
