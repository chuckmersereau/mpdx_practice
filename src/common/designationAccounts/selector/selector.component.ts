import designationAccounts, { DesignationAccountsService } from '../designationAccounts.service';

class SelectorController {
    constructor(
        private $rootScope: ng.IRootScopeService,
        private designationAccounts: DesignationAccountsService
    ) {}
    onChange() {
        this.$rootScope.$emit('designationAccountSelectorChanged', this.designationAccounts.selected);
    }
}

const Selector = {
    controller: SelectorController,
    template: require('./selector.html')
};

export default angular.module('mpdx.common.designationAccounts.selector.component', [
    designationAccounts
]).component('designationAccountsSelector', Selector).name;
