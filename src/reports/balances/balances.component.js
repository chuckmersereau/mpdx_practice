import reduce from 'lodash/fp/reduce';
import toInteger from 'lodash/fp/toInteger';

class BalancesController {
    constructor(
        $rootScope, blockUI,
        designationAccounts
    ) {
        this.$rootScope = $rootScope;
        this.designationAccounts = designationAccounts;

        this.blockUI = blockUI.instances.get('balances');

        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
    }
    load() {
        this.loading = true;
        return this.designationAccounts.load(true).then(() => {
            this.loading = false;
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
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.reports.balances.component', [
    blockUI,
    designationAccounts, locale
]).component('balances', Balances).name;
