import concat from 'lodash/fp/concat';
import groupBy from 'lodash/fp/groupBy';
import includes from 'lodash/fp/includes';
import indexOf from 'lodash/fp/indexOf';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import sumBy from 'lodash/fp/sumBy';

class MonthlyController {
    api;
    errorOccurred;
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
        this.api.get('reports/expected_monthly_totals', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
            this.$log.debug('reports/expected_monthly_totals', data);
            this.total_currency = data.total_currency;
            this.total_currency_symbol = data.total_currency_symbol;
            const availableDonationTypes = ['received', 'likely', 'unlikely'];
            const donations = groupBy('type', data.expected_donations);
            this.donationsByType = reduce((result, donationsForType, type) => {
                if (includes(type, availableDonationTypes)) {
                    result = concat(result, {
                        type: type,
                        order: indexOf(type, availableDonationTypes),
                        donations: donationsForType,
                        sum: sumBy('converted_amount', donationsForType)
                    });
                }
                return result;
            }, [], donations);
            this.sumOfAllCategories = sumBy('sum', this.donationsByType);
            this.loading = false;
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
        return indexOf(index, this.activePanels) > -1;
    }
}

const Monthly = {
    controller: MonthlyController,
    template: require('./monthly.html')
};

export default angular.module('mpdx.reports.monthly.component', [])
        .component('monthly', Monthly).name;
