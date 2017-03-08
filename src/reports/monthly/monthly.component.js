class MonthlyController {
    api;
    constructor(
        $log,
        $rootScope,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.sumOfAllCategories = 0;

        this.errorOccurred = false;
        this.loading = true;
        this.activePanels = [0, 1, 2];

        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.loadExpectedMonthlyTotals();
        });

        this.loadExpectedMonthlyTotals();
    }
    $onDestroy() {
        this.watcher();
    }
    loadExpectedMonthlyTotals() {
        this.activePanels = [0, 1, 2];
        this.loading = true;
        this.api.get('reports/expected_monthly_totals', { filter: {account_list_id: this.api.account_list_id} }).then((data) => {
            this.$log.debug('reports/expected_monthly_totals', data);
            this.loading = false;
            this.total_currency = data.total_currency;
            this.total_currency_symbol = data.total_currency_symbol;

            const availableDonationTypes = ['received', 'likely', 'unlikely'];
            this.donationsByType = _(data.expected_donations)
                .groupBy('type')
                .defaults(_.zipObject(availableDonationTypes))
                .map((donationsForType, type) => {
                    return {
                        type: type,
                        order: _.indexOf(availableDonationTypes, type),
                        donations: donationsForType,
                        sum: _.sum(_.map(donationsForType, 'converted_amount'))
                    };
                })
                .value();
            this.sumOfAllCategories = _.sum(_.map(this.donationsByType, 'sum'));
        }).catch(() => {
            this.errorOccurred = true;
        });
    }
    percentage(donationType) {
        if (this.sumOfAllCategories === 0) {
            return 0;
        }

        return donationType.sum / this.sumOfAllCategories * 100;
    }
    isOpen(index) {
        return _.indexOf(this.activePanels, index) >= 0;
    }
}

const Monthly = {
    controller: MonthlyController,
    template: require('./monthly.html')
};

export default angular.module('mpdx.reports.monthly.component', [])
        .component('monthly', Monthly).name;
