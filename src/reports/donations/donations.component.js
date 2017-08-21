import defaultTo from 'lodash/fp/defaultTo';
import map from 'lodash/fp/map';
import unionBy from 'lodash/fp/unionBy';
import moment from 'moment';
import reduceObject from 'common/fp/reduceObject';

class DonationsController {
    constructor(
        $rootScope, $log,
        $stateParams,
        contacts, designationAccounts, donations, locale
    ) {
        this.$log = $log;
        this.$stateParams = $stateParams;
        this.contacts = contacts;
        this.designationAccounts = designationAccounts;
        this.donations = donations;
        this.locale = locale;

        this.enableNext = false;
        this.data = [];
        this.listLoadCount = 0;
        this.loading = false;
        this.meta = {};
        this.models = {
            addTags: {
                newTag: ''
            }
        };
        this.page = 0;
        this.pageSize = 0;
        this.totalContactCount = 0;

        $rootScope.$on('accountListUpdated', () => {
            this.load(1, true);
        });
    }

    $onInit() {
        if (!this.inContact) {
            this.startDate = defaultTo(moment().startOf('month'), this.$stateParams.startDate);
        }
        this.load(1, true);
    }

    $onChanges(changesObj) {
        if (changesObj.contact && !changesObj.contact.isFirstChange()) {
            this.load(1, true);
        }
    }

    loadMoreDonations() {
        if (this.loading || this.page >= this.meta.pagination.total_pages) {
            return;
        }
        this.load(this.page + 1);
    }

    load(page, reset = false) {
        let currentCount;
        if (reset) {
            this.meta = {};
            this.data = [];
            this.totals = {};
            this.listLoadCount++;
            currentCount = angular.copy(this.listLoadCount);
        }

        this.page = page;

        let params = {
            page: this.page
        };

        if (!this.inContact) {
            this.setMonths();
            params.startDate = this.startDate;
            params.endDate = this.endDate;
        } else if (this.contacts.current.donor_accounts) {
            params.donorAccountId = map('id', this.contacts.current.donor_accounts).join();
            if (params.donorAccountId === '') { return Promise.reject(); }
        }

        this.loading = true;
        return this.donations.getDonations(params).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('donations page ' + data.meta.pagination.page, data);
            this.loading = false;
            if (reset && currentCount !== this.listLoadCount) { return; }
            this.meta = data.meta;
            if (reset) {
                this.data = data;
            } else {
                this.data = unionBy('id', this.data, data);
            }
            if (parseInt(this.meta.pagination.page) === this.meta.pagination.total_pages) {
                this.totals = reduceObject((result, donation) => {
                    if (result[donation.currency]) {
                        result[donation.currency]['amount'] += parseFloat(donation.amount);
                    } else {
                        result[donation.currency] = { amount: parseFloat(donation.amount), count: 0 };
                    }
                    result[donation.currency]['count']++;
                    return result;
                }, {}, this.data);
            }
            return this.data;
        });
    }

    setMonths() {
        this.previousMonth = moment(this.startDate).subtract(1, 'month');
        this.nextMonth = moment(this.startDate).add(1, 'month');
        this.endDate = moment(this.startDate).endOf('month');
        this.enableNext = moment(this.nextMonth).isBefore(moment());
    }

    gotoNextMonth() {
        this.startDate = this.nextMonth;
        this.load(1, true);
    }

    gotoPrevMonth() {
        this.startDate = this.previousMonth;
        this.load(1, true);
    }

    openDonationModal(donation) {
        return this.donations.openDonationModal(donation).then(() => {
            this.load();
        });
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
import contacts from 'contacts/contacts.service';
import designationAccounts from 'common/designationAccounts/designationAccounts.service';
import donations from 'reports/donations/donations.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.reports.donations.component', [
    uiRouter,
    contacts, designationAccounts, donations, locale
]).component('donations', Donations).name;
