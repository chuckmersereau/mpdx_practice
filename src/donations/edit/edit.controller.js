class EditDonationController {
    currentAccountList;

    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;
    }
}

export default angular.module('mpdx.donation.edit.controller', [])
    .controller('editDonationController', EditDonationController).name;