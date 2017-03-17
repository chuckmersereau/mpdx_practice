import concat from 'lodash/fp/concat';
import defaults from 'lodash/fp/defaults';
import groupBy from 'lodash/fp/groupBy';
import indexOf from 'lodash/fp/indexOf';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import sumBy from 'lodash/fp/sumBy';
import zipObject from 'lodash/fp/zipObject';

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
    }
    $onDestroy() {
        this.watcher();
    }
    loadExpectedMonthlyTotals() {
        this.activePanels = [0, 1, 2];
        if (this.loading !== this.api.account_list_id) {
            this.loading = this.api.account_list_id;

            this.api.get('reports/expected_monthly_totals', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
                this.$log.debug('reports/expected_monthly_totals', data);
                this.total_currency = data.total_currency;
                this.total_currency_symbol = data.total_currency_symbol;

                const availableDonationTypes = zipObject(['received', 'likely', 'unlikely']);
                const grouped = groupBy('type', data.expected_donations);
                const donations = defaults(availableDonationTypes, grouped);
                this.donationsByType = reduce((result, donationsForType, type) => {
                    return concat(result, {
                        type: type,
                        order: indexOf(type, availableDonationTypes),
                        donations: donationsForType,
                        sum: sumBy('converted_amount', donationsForType)
                    });
                }, [], donations);
                this.sumOfAllCategories = sumBy('sum', this.donationsByType);
                this.loading = false;
            }).catch(() => {
                this.errorOccurred = true;
            });
        }
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
