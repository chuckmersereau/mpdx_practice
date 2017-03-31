import reduce from 'lodash/fp/reduce';
import toInteger from 'lodash/fp/toInteger';

class BalancesController {
    api;
    constructor(
        $log, designationAccounts, blockUI
    ) {
        this.$log = $log;
        this.designationAccounts = designationAccounts;
        this.blockUI = blockUI.instances.get('balances');
    }
    $onInit() {
        this.load();
    }
    load() {
        this.blockUI.start();
        this.designationAccounts.load().then(() => {
            this.blockUI.stop();
            // this.total_currency = data.total_currency;
            // this.total_currency_symbol = data.total_currency_symbol;
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

export default angular.module('mpdx.reports.balances.component', [])
    .component('balances', Balances).name;
