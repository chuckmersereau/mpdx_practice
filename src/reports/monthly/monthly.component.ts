import { concat, groupBy, includes, indexOf, sumBy } from 'lodash/fp';
import joinComma from '../../common/fp/joinComma';
import reduceObject from '../../common/fp/reduceObject';

class MonthlyController {
    activePanels: number[];
    donationsByType: any[];
    errorOccurred: boolean;
    loading: boolean;
    sumOfAllCategories: number;
    total_currency: any;
    total_currency_symbol: string;
    watcher: any;
    watcher2: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private api: ApiService,
        private designationAccounts: DesignationAccountsService
    ) {
        this.sumOfAllCategories = 0;
        this.errorOccurred = false;
        this.loading = true;
        this.activePanels = [0, 1, 2];
    }
    $onInit() {
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        this.watcher2 = this.$rootScope.$on('designationAccountSelectorChanged', () => {
            this.load();
        });

        this.load();
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
    }
    load() {
        this.activePanels = [0, 1, 2];
        this.loading = true;
        let params: any = { filter: { account_list_id: this.api.account_list_id } };
        if (this.designationAccounts.selected.length > 0) {
            params.filter.designation_account_id = joinComma(this.designationAccounts.selected);
        }
        return this.api.get('reports/expected_monthly_totals', params).then((data: any) => {
            this.$log.debug('reports/expected_monthly_totals', data);
            this.total_currency = data.total_currency;
            this.total_currency_symbol = data.total_currency_symbol;
            const availableDonationTypes = ['received', 'likely', 'unlikely'];
            const donations = groupBy('type', data.expected_donations);
            this.donationsByType = reduceObject((result, donationsForType, type) => {
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
            this.loading = false;
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

import api, { ApiService } from '../../common/api/api.service';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';

export default angular.module('mpdx.reports.monthly.component', [
    api, designationAccounts
]).component('monthly', Monthly).name;
