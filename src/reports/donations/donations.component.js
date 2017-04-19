import defaultTo from 'lodash/fp/defaultTo';
import map from 'lodash/fp/map';
import moment from 'moment';

class DonationsController {
    $rootScope;
    blockUI;
    byMonth;
    contact;
    designationAccounts;
    donations;

    constructor(
        $state, $stateParams, $rootScope, blockUI,
        contacts, designationAccounts, donations
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.contacts = contacts;
        this.designationAccounts = designationAccounts;
        this.donations = donations;
        this.blockUI = blockUI.instances.get('donations');

        this.enableNext = false;
        this.donationsList = [];
        this.page = 1;
    }

    $onInit() {
        if (this.byMonth) {
            this.startDate = defaultTo(moment().startOf('month'), this.$stateParams.startDate);
        }

        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load(1);
        });
        this.load(1);
    }

    $onChanges(changesObj) {
        if (changesObj.contact && !changesObj.contact.isFirstChange()) {
            this.load(1);
        }
    }

    $onDestroy() {
        this.watcher();
    }

    load(page) {
        if (page) {
            this.page = page;
        }
        this.setMonths();
        this.blockUI.start();
        let params = {
            startDate: this.startDate,
            endDate: this.endDate,
            page: this.page
        };
        if (this.inContact && this.contacts.current.donor_accounts && this.contacts.current.donor_accounts.length > 0) {
            params.donorAccountId = map('id', this.contacts.current.donor_accounts).join();
        } else if (this.inContact && (!this.contacts.current.donor_accounts || this.contacts.current.donor_accounts.length === 0)) {
            //don't try to get donations for a contact if the contact has no donor accounts. causes filter to be blank and return all.
            this.blockUI.stop();
            return;
        }
        this.donations.getDonations(params).then((data) => {
            this.donationsList = data;
            this.blockUI.stop();
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
        this.load(1);
    }

    gotoPrevMonth() {
        this.startDate = this.previousMonth;
        this.load(1);
    }

    openDonationModal(donation) {
        this.donations.openDonationModal(donation).finally(() => {
            this.load();
        });
    }
}

const Donations = {
    controller: DonationsController,
    template: require('./donations.html'),
    bindings: {
        inContact: '<',
        byMonth: '<'
    }
};

export default angular.module('mpdx.reports.donations.component', [])
    .component('donations', Donations).name;
