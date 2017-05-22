import reduce from 'lodash/fp/reduce';
import toInteger from 'lodash/fp/toInteger';

class BalancesController {
    designationAccounts;

    constructor(
        $rootScope, blockUI,
        designationAccounts
    ) {
        this.$rootScope = $rootScope;
        this.blockUI = blockUI.instances.get('balances');

        this.designationAccounts = designationAccounts;

        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
    }
    load() {
        this.blockUI.start();
        return this.designationAccounts.load(true).then(() => {
            this.blockUI.reset();
            this.updateTotal();
        });
    }
    onToggle(designation) {
        designation.active = !designation.active;
        this.updateTotal();
    }
    updateTotal() {
        this.converted_total = reduce((sum, designation) =>
            sum + toInteger(designation.active ? designation.converted_balance : 0)
        , 0, this.designationAccounts.data);
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

import blockUI from 'angular-block-ui';
import designationAccounts from 'common/designationAccounts/designationAccounts.service';

export default angular.module('mpdx.reports.balances.component', [blockUI, designationAccounts])
    .component('balances', Balances).name;
