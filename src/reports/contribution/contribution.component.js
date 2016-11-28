class ContributionReportController {
    constructor(
        blockUI, gettextCatalog,
        currentAccountList, currencyService, donationsService
    ) {
        this._ = _;
        this.currencyService = currencyService;
        this.currentAccountList = currentAccountList;
        this.donationsService = donationsService;
        this.gettextCatalog = gettextCatalog;
        this.moment = moment;

        this.blockUI = blockUI.instances.get('contributionReport');
        this.blockUI.start();
        this.enableNext = false;
        this.donations = {};
        this.allDonations = [];
        this.donationTotals = {};
        this.donors = {};

        this.months = [];
        for (let i = 0; i < 12; i++) {
            this.months[i] = moment(this.startDate, 'l').add(i, 'months').format('MMM YY');
        }
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
        const startDate = moment(this.startDate, 'l');
        this.previousYear = startDate.subtract(1, 'year').format('l');
        this.nextYear = startDate.add(1, 'year').format('l');
        if (!this.endDate) {
            this.endDate = startDate.add(1, 'year').format('l');
        }
        const endDate = moment(this.endDate, 'l');
        this.enableNext = moment(this.nextYear, 'l').isBefore(moment());
        this.index = this.startDate.split('/').join('');
        if (!_.has(this.donations, this.index)) {
            this.donations[this.index] = _.filter(this.allDonations, donation => moment(donation.donation_date, 'YYYY-M-D').isBetween(startDate, endDate));
            this.donors[this.index] = {};
            let donors = this.donors[this.index];
            this.donationTotals[this.index] = {};
            _.each(this.donations[this.index], (donation) => {
                if (!donors[donation.name]) {
                    donors[donation.name] = {
                        name: donation.name,
                        months: new Array(13).join('0').split('').map(parseFloat),
                        count: 0,
                        commitment: 0,
                        currency: donation.currency,
                        total: 0,
                        contactId: donation.contact_id
                    };
                }
                let donationMonth = moment(donation.donation_date, 'YYYY-M-D').month() - 1;
                let donationAmount = parseFloat(donation.amount.replace(/[^\d.]/, ''));
                donors[donation.name].months[donationMonth] += donationAmount;
                donors[donation.name].count++;
                donors[donation.name].total += donationAmount;

                if (!this.donationTotals[this.index][donation.currency]) {
                    this.donationTotals[this.index][donation.currency] = {
                        months: new Array(13).join('0').split('').map(parseFloat),
                        count: 0,
                        currency: donation.currency,
                        total: 0
                    };
                }
                this.donationTotals[this.index][donation.currency].months[donationMonth] += donationAmount;
                this.donationTotals[this.index][donation.currency].total += donationAmount;
                this.donationTotals[this.index][donation.currency].count++;
            });
        }
    }
    gotoNextYear() {
        this.startDate = this.nextYear;
        this.endDate = null;
        this.init();
    }
    gotoPrevYear() {
        this.startDate = this.previousYear;
        this.endDate = null;
        this.init();
    }
    export() {
        const columnHeaders = [[
            this.gettextCatalog.getString('Donor'),
            this.gettextCatalog.getString('Avg'),
            this.gettextCatalog.getString('Min'),
            ...this.months,
            this.gettextCatalog.getString('Total')
        ]];
        const totals = _.map(this.donationTotals[this.index], (total) => {
            return [
                this.gettextCatalog.getString(`Total ${total.currency} Donations`),
                `${this.currencyService.list[total.currency].symbol}${_.round(_.mean(total.months))}`,
                `${this.currencyService.list[total.currency].symbol}${_.min(total.months)}`,
                ..._.map(total.months, month => `${this.currencyService.list[total.currency].symbol}${month}`),
                `${this.currencyService.list[total.currency].symbol}${total.total}`
            ];
        });
        const donorRows = _.map(this.donors[this.index], (donor) => {
            return [
                donor.name,
                `${this.currencyService.list[donor.currency].symbol}${_.round(_.mean(donor.months))}`,
                `${this.currencyService.list[donor.currency].symbol}${_.min(donor.months)}`,
                ..._.map(donor.months, month => `${this.currencyService.list[donor.currency].symbol}${month}`),
                `${this.currencyService.list[donor.currency].symbol}${donor.total}`
            ];
        });

        return [
            ...columnHeaders,
            ...totals,
            ...donorRows
        ];
    }
}

const ContributionReport = {
    template: require('./contribution.html'),
    controller: ContributionReportController,
    bindings: {
        startDate: '<',
        endDate: '<'
    }
};

export default angular.module('mpdx.reports.contribution.component', [])
    .component('contributionReport', ContributionReport).name;