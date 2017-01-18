class DonationsReportController {
    api;
    currency;
    designationAccounts;
    getDonations;
    donations;
    donationsReport;

    constructor(
        $rootScope, blockUI,
        designationAccounts, currency, donationsReport
    ) {
        this.currency = currency;
        this.designationAccounts = designationAccounts;
        this.donationsReport = donationsReport;

        this.blockUI = blockUI.instances.get('donations');
        this.blockUI.start();
        this.enableNext = false;
        this.donations = [];
        this.donationTotals = {};

        this.startDate = moment().startOf('month');

        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.init();
        });
    }
    $onDestroy() {
        this.watcher();
    }
    init() {
        this.setMonths();
        this.blockUI.start();
        this.donationsReport.getDonations({ startData: this.startDate, endDate: this.endDate }).then((data) => {
            this.donations = data;
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
        this.init();
    }
    gotoPrevMonth() {
        this.startDate = this.previousMonth;
        this.init();
    }
}

const DonationsReport = {
    template: require('./donations.html'),
    controller: DonationsReportController
};

export default angular.module('mpdx.reports.donations.component', [])
    .component('donationsReport', DonationsReport).name;
