class DonationsController {
    currencyService;
    currentAccountList;
    getDonations;
    donations;
    donationsService;

    constructor(
        blockUI,
        currentAccountList, currencyService, donationsService
    ) {
        this.currencyService = currencyService;
        this.currentAccountList = currentAccountList;
        this.donationsService = donationsService;

        this.blockUI = blockUI.instances.get('donations');
        this.blockUI.start();
        this.enableNext = false;
        this.donations = {};
        this.allDonations = [];
        this.donationTotals = {};
    }
    $onChanges() {
        if (this.donationsService.data === null) {
            this.donationsService.getDonations().then((data) => {
                this.loadingFinished(data);
            });
        } else {
            this.loadingFinished(this.donationsService.data);
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

const Donations = {
    template: require('./donations.html'),
    controller: DonationsController,
    bindings: {
        startDate: '<'
    }
};

export default angular.module('mpdx.donations.component', [])
    .component('donations', Donations).name;