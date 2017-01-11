class DonationsReportController {
    api;
    currency;
    designationAccounts;
    getDonations;
    donations;
    donationsReport;

    constructor(
        $rootScope, blockUI,
        api, designationAccounts, currency, donationsReport
    ) {
        console.error('donations report - fix endpoint date filtering, add contact name to result');
        this.api = api;
        this.currency = currency;
        this.designationAccounts = designationAccounts;
        this.donationsReport = donationsReport;

        this.blockUI = blockUI.instances.get('donations');
        this.blockUI.start();
        this.enableNext = false;
        this.donations = {};
        this.allDonations = [];
        this.donationTotals = {};

        this.watcher = $rootScope.$on('accountListUpdated', () => {
            if (this.donationsReport.data === null) {
                this.donationsReport.getDonations({ startData: this.startDate, endDate: this.endDate }).then((data) => {
                    this.loadingFinished(data);
                });
            }
        });
    }
    $onChanges() {
        this.setMonths();
        if (this.donationsReport.data === null) {
            if (this.api.account_list_id) {
                this.donationsReport.getDonations({ startData: this.startDate, endDate: this.endDate }).then((data) => {
                    this.loadingFinished(data);
                });
            }
        } else {
            this.loadingFinished(this.donationsReport.data);
        }
    }
    $onDestroy() {
        this.watcher();
    }
    loadingFinished(data) {
        this.blockUI.stop();
        this.allDonations = data.data;
        this.init();
    }
    init() {
        this.setMonths();
        this.index = this.startDate.split('/').join('');
        if (!_.has(this.donations, this.index)) {
            this.donations[this.index] = _.filter(this.allDonations, donation => moment(donation.donation_date, 'YYYY-M-D').startOf('month').format('l') === this.startDate);
            this.donationTotals[this.index] = {};
            _.each(this.donations[this.index], (donation) => {
                if (!this.donationTotals[this.index][donation.currency]) {
                    this.donationTotals[this.index][donation.currency] = {
                        amount: parseFloat(0),
                        count: 0,
                        currency: donation.currency
                    };
                }
                this.donationTotals[this.index][donation.currency].amount += parseFloat(donation.amount.replace(/[^\d.]/, ''));
                this.donationTotals[this.index][donation.currency].count++;
            });
        }
    }
    setMonths() {
        this.previousMonth = moment(this.startDate, 'l').subtract(1, 'month').format('l');
        this.nextMonth = moment(this.startDate, 'l').add(1, 'month').format('l');
        if (!this.endDate) {
            this.endDate = moment(this.startDate, 'l').endOf('month').format('l');
        }
        this.enableNext = moment(this.nextMonth, 'l').isBefore(moment());
    }
    gotoNextMonth() {
        this.startDate = this.nextMonth;
        this.endDate = null;
        this.init();
    }
    gotoPrevMonth() {
        this.startDate = this.previousMonth;
        this.endDate = null;
        this.init();
    }
}

const DonationsReport = {
    template: require('./donationsReport.html'),
    controller: DonationsReportController,
    bindings: {
        startDate: '<'
    }
};

export default angular.module('mpdx.reports.donations.component', [])
    .component('donationsReport', DonationsReport).name;