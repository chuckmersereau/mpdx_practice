import * as moment from 'moment';
import {
    assign,
    defaultTo,
    findIndex,
    map,
    pullAllBy,
    toNumber
} from 'lodash/fp';
import { StateParams } from '@uirouter/core';
import api, { ApiService } from '../../common/api/api.service';
import contacts, { ContactsService } from '../../contacts/contacts.service';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';
import donations, { DonationsService } from './donations.service';
import joinComma from '../../common/fp/joinComma';
import locale, { LocaleService } from '../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';
import uiRouter from '@uirouter/angularjs';

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
    watcher: () => void;
    watcher2: () => void;
    watcher4: () => void;
    watcher5: () => void;
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
        this.totals = {};

        this.watcher5 = $rootScope.$on('accountListUpdated', () => {
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
        this.watcher4();
        this.watcher5();
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
            donation.converted_symbol = this.serverConstants.getPledgeCurrencySymbol(donation.converted_currency);
            return donation;
        }, data);
    }
    setMonths() {
        this.previousMonth = moment(this.startDate).subtract(1, 'month');
        this.nextMonth = moment(this.startDate).add(1, 'month');
        this.endDate = moment(this.startDate).endOf('month');
        this.enableNext = moment(this.nextMonth).isBefore(moment());
    }
    gotoNextMonth() {
        this.startDate = this.nextMonth;
        this.totals = {};
        this.load();
    }
    gotoPrevMonth() {
        this.startDate = this.previousMonth;
        this.totals = {};
        this.load();
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
    sumCurrency(currency, amount): void {
        this.totals[currency] = defaultTo(0, this.totals[currency]) + toNumber(amount);
    }
}

const Donations = {
    controller: DonationsController,
    template: require('./donations.html'),
    bindings: {
        inContact: '<'
    }
};

export default angular.module('mpdx.reports.donations.component', [
    uiRouter,
    api, contacts, designationAccounts, donations, locale, serverConstants
]).component('donations', Donations).name;
