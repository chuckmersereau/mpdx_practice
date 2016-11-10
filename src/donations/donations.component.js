class DonationsController {
}

const Donations = {
    template: require('./donations.html'),
    controller: DonationsController
};

export default angular.module('mpdx.donations.component', [])
    .component('donations', Donations).name;