class BalancesReportController {
    constructor(
        api, state
    ) {
        this.api = api;
        this.state = state;

        this.errorOccurred = false;
    }
    $onInit() {
        this.api.get('reports/balances').then((data) => {
            this.designations = data.designations;
            _.each(this.designations, (d) => {
                d.balanceIncluded = d.active;
            });
            this.total_currency = data.total_currency;
            this.total_currency_symbol = data.total_currency_symbol;
            this.updateTotal();
        }).catch(() => {
            this.errorOccurred = true;
        });
    }
    onToggle(designation) {
        designation.balanceIncluded = !designation.balanceIncluded;
        this.updateTotal();
    }
    updateTotal() {
        this.converted_total = _.reduce(this.designations, (sum, designation) =>
            sum + (designation.balanceIncluded ? designation.converted_balance : 0)
        , 0);
    }
}

const Balances = {
    controller: BalancesReportController,
    template: require('./balances.html')
};

export default angular.module('mpdx.reports.balances.component', [])
    .component('balancesReport', Balances).name;
