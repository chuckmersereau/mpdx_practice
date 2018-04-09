class SelectorController {
    constructor(
        $rootScope,
        designationAccounts
    ) {
        this.$rootScope = $rootScope;
        this.designationAccounts = designationAccounts;
    }
    onChange() {
        this.$rootScope.$emit('designationAccountSelectorChanged', this.designationAccounts.selected);
    }
}

const Selector = {
    controller: SelectorController,
    template: require('./selector.html')
};

import designationAccounts from 'common/designationAccounts/designationAccounts.service';

export default angular.module('mpdx.common.designationAccounts.selector.component', [
    designationAccounts
]).component('designationAccountsSelector', Selector).name;
