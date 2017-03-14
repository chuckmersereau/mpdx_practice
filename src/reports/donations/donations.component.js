class DonationsReportController {
    $rootScope;
    blockUI;
    designationAccounts;
    donations;

    constructor(
        $rootScope, blockUI, designationAccounts, donations
    ) {
        this.designationAccounts = designationAccounts;
        this.donations = donations;

        this.blockUI = blockUI.instances.get('donations');
        this.enableNext = false;
        this.startDate = moment().startOf('month');
        this.donationsList = [];
        this.page = 1;
        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.load(1);
        });

        this.load(1);
    }

    load(page) {
        if (page) {
            this.page = page;
        }
        this.setMonths();
        this.blockUI.start();
        this.donations.getDonations({ startDate: this.startDate, endDate: this.endDate, page: this.page }).then((data) => {
            this.donationsList = data;
            this.blockUI.stop();
        });
    }

    $onDestroy() {
        this.watcher();
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

const DonationsReport = {
    template: require('./donations.html'),
    controller: DonationsReportController
};

export default angular.module('mpdx.reports.donations.component', [])
    .component('donations', DonationsReport).name;
