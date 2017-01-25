class BalancesReportController {
    api;
    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;
    }
    $onInit() {
        this.api.get('reports/balances', {include: 'designation_accounts'}).then((data) => {
            this.$log.debug('reports/balances', data);
            this.designations = data.designation_accounts;
            this.total_currency = data.total_currency;
            this.total_currency_symbol = data.total_currency_symbol;
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
