class DonationsController {
    $rootScope;
    blockUI;
    designationAccounts;
    currency;
    donations;

    constructor(
        $rootScope, blockUI, designationAccounts, currency, donations
    ) {
        this.$rootScope = $rootScope;
        this.currency = currency;
        this.designationAccounts = designationAccounts;
        this.donations = donations;

        this.blockUI = blockUI.instances.get('donations');
        this.enableNext = false;
        this.startDate = moment().startOf('month');
        this.donationsList = [];
        this.page = 1;
    }

    $onInit() {
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load(1);
        });
        this.load(1);
    }

    $onChanges() {
        this.load(1);
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
        if (this.contact && this.contact.donor_accounts) {
            params.donorAccountId = _.map(this.contact.donor_accounts, 'id').join();
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
        contact: '<'
    }
};

export default angular.module('mpdx.reports.donations.component', [])
    .component('donations', Donations).name;
