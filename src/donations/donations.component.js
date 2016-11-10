class DonationsController {
    currentAccountList;
    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;
        this.enableNext = false;
    }
    $onInit() {
        this.init();
    }
    $onChanges() {
        this.init();
    }
    init() {
        this.previousMonth = moment(this.startDate, 'l').subtract(1, 'month').format('l');
        this.nextMonth = moment(this.startDate, 'l').add(1, 'month').format('l');
        if (!this.endDate) {
            this.endDate = moment(this.startDate, 'l').endOf('month').format('l');
        }
        this.enableNext = moment(this.nextMonth, 'l').isBefore(moment());
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