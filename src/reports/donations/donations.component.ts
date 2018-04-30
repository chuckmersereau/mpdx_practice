import {
    assign,
    defaultTo,
    findIndex,
    map,
    pullAllBy,
    reduce,
    toNumber
} from 'lodash/fp';
import joinComma from '../../common/fp/joinComma';
import * as moment from 'moment';

class DonationsController {
    data: any;
    enableNext: boolean;
    endDate: moment.Moment;
    inContact: boolean;
    listLoadCount: number;
    loading: boolean;
    meta: any;
    nextMonth: moment.Moment;
    page: number;
    pageSize: number;
    previousMonth: moment.Moment;
    sort: string;
    sortReverse: boolean;
    startDate: moment.Moment;
    totals: any;
    totalContactCount: number;
    totalsPosition: number;
    watcher: any;
    watcher2: any;
    watcher3: any;
    watcher4: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $stateParams: StateParams,
        private api: ApiService,
        private contacts: ContactsService,
        private designationAccounts: DesignationAccountsService,
        private donations: DonationsService,
        private locale: LocaleService,
        private serverConstants: ServerConstantsService
    ) {
        this.enableNext = false;
        this.data = [];
        this.listLoadCount = 0;
        this.loading = false;
        this.meta = {};
        this.page = 0;
        this.pageSize = 25;
        this.totalContactCount = 0;
        this.sort = 'donation_date';
        this.sortReverse = true;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        if (!this.inContact) {
            this.startDate = defaultTo(moment().startOf('month'), this.$stateParams.startDate);
        }
        this.load();

        this.watcher = this.$rootScope.$on('donationUpdated', (e, donation) => {
            const foundIndex = findIndex({ id: donation.id }, this.data);
            const index = foundIndex > -1 ? foundIndex : this.data.length;
            this.data[index] = assign(this.data[index], donation);
        });

        this.watcher2 = this.$rootScope.$on('donationRemoved', (e, donation) => {
            this.data = pullAllBy('id', [donation], this.data);
            this.load();
        });

        this.watcher3 = this.$rootScope.$on('chartDataUpdated', () => {
            this.totalsPosition = this.donations.chartData.months_to_dates.length - 1;
            this.calculateTotals();
        });

        this.watcher4 = this.$rootScope.$on('designationAccountSelectorChanged', () => {
            this.load();
        });
    }
    $onChanges(changesObj) {
        if (changesObj.contact && !changesObj.contact.isFirstChange()) {
            this.load();
        }
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
        this.watcher3();
    }
    load() {
        this.meta = {};
        this.data = [];
        this.listLoadCount++;
        const currentCount = angular.copy(this.listLoadCount);

        let params: any = {};

        if (this.designationAccounts.selected.length > 0) {
            params.designationAccountId = joinComma(this.designationAccounts.selected);
        }

        if (!this.inContact) {
            this.setMonths();
            params.startDate = this.startDate;
            params.endDate = this.endDate;
        } else if (this.contacts.current.donor_accounts) {
            if (this.contacts.current.donor_accounts.length === 0) {
                return this.$q.reject();
            }
            params.donorAccountId = map('id', this.contacts.current.donor_accounts).join();
        }

        this.loading = true;
        return this.getDonations(params).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug('donations report', data);
            this.loading = false;
            if (this.loadedOutOfTurn(currentCount)) {
                return null;
            }
            this.meta = data.meta;
            this.data = this.mutateDataForSorts(data);
            return this.data;
        });
    }
    loadedOutOfTurn(currentCount) {
        return currentCount !== this.listLoadCount;
    }
    mutateDataForSorts(data) {
        return map((donation) => {
            donation.converted_amount = toNumber(donation.converted_amount);
            donation.currency_symbol = this.serverConstants.getPledgeCurrencySymbol(donation.currency);
            donation.converted_symbol = this.serverConstants.getPledgeCurrencySymbol(donation.converted_currency);
            return donation;
        }, data);
    }
    calculateTotals() {
        this.totals = reduce((result, donation) => assign(result, {
            [donation.currency]: donation.month_totals[this.totalsPosition].amount
        }), {}, this.donations.chartData.totals);
    }
    setMonths() {
        this.previousMonth = moment(this.startDate).subtract(1, 'month');
        this.nextMonth = moment(this.startDate).add(1, 'month');
        this.endDate = moment(this.startDate).endOf('month');
        this.enableNext = moment(this.nextMonth).isBefore(moment());
    }
    gotoNextMonth() {
        this.startDate = this.nextMonth;
        this.totalsPosition++;
        this.load().then(() => {
            this.calculateTotals();
        });
    }
    gotoPrevMonth() {
        this.startDate = this.previousMonth;
        this.totalsPosition--;
        this.load().then(() => {
            this.calculateTotals();
        });
    }
    getDonations({
        startDate = null, endDate = null, donorAccountId = null, designationAccountId = null
    } = {}) {
        let params: any = {
            per_page: 10000,
            fields: {
                contacts: 'name',
                designation_account: 'display_name,designation_number',
                donor_account: 'display_name,account_number',
                appeal: 'name'
            },
            filter: {},
            include: 'designation_account,donor_account,contact,appeal'
        };
        if (donorAccountId) {
            params.filter.donor_account_id = donorAccountId;
        }
        if (designationAccountId) {
            params.filter.designation_account_id = designationAccountId;
        }
        if (startDate && endDate && moment.isMoment(startDate) && moment.isMoment(endDate)) {
            params.filter.donation_date = `${startDate.format('YYYY-MM-DD')}..${endDate.format('YYYY-MM-DD')}`;
        }
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`, params).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/donations`, data);
            return data;
        });
    }
    changeSort(field) {
        if (this.sort === field) {
            this.sortReverse = !this.sortReverse;
            return;
        }
        this.sort = field;
        this.sortReverse = false;
    }
}

const Donations = {
    controller: DonationsController,
    template: require('./donations.html'),
    bindings: {
        inContact: '<'
    }
};

import uiRouter from '@uirouter/angularjs';
import { StateParams } from '@uirouter/core';
import api, { ApiService } from '../../common/api/api.service';
import contacts, { ContactsService } from '../../contacts/contacts.service';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';
import donations, { DonationsService } from './donations.service';
import locale, { LocaleService } from '../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.reports.donations.component', [
    uiRouter,
    api, contacts, designationAccounts, donations, locale, serverConstants
]).component('donations', Donations).name;
