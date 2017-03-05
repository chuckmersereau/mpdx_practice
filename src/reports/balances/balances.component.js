class BalancesReportController {
    api;
    constructor(
        $log,
        designationAccounts
    ) {
        this.$log = $log;
        this.designationAccounts = designationAccounts;
    }
    $onInit() {
        this.designationAccounts.load().then((designationAccounts) => {
            this.designations = designationAccounts;
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
        this.converted_total = _.reduce(this.designations, (sum, designation) =>
            sum + (designation.active ? designation.converted_balance : 0)
        , 0);
    }
}

const Balances = {
    controller: BalancesReportController,
    template: require('./balances.html')
};

export default angular.module('mpdx.reports.balances.component', [])
    .component('balancesReport', Balances).name;
