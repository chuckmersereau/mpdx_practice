class DonationsReportController {
    currency;
    currentAccountList;
    getDonations;
    donations;
    donationsReportService;

    constructor(
        blockUI,
        currentAccountList, currency, donationsReportService
    ) {
        this.currency = currency;
        this.currentAccountList = currentAccountList;
        this.donationsReportService = donationsReportService;

        this.blockUI = blockUI.instances.get('donations');
        this.blockUI.start();
        this.enableNext = false;
        this.donations = {};
        this.allDonations = [];
        this.donationTotals = {};
    }
    $onChanges() {
        if (this.donationsReportService.data === null) {
            this.donationsReportService.getDonations().then((data) => {
                this.loadingFinished(data);
            });
        } else {
            this.loadingFinished(this.donationsReportService.data);
        }
    }
    loadingFinished(data) {
        this.blockUI.stop();
        this.allDonations = data.donations;
        this.init();
    }
    init() {
        this.previousMonth = moment(this.startDate, 'l').subtract(1, 'month').format('l');
        this.nextMonth = moment(this.startDate, 'l').add(1, 'month').format('l');
        if (!this.endDate) {
            this.endDate = moment(this.startDate, 'l').endOf('month').format('l');
        }
        this.enableNext = moment(this.nextMonth, 'l').isBefore(moment());
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
