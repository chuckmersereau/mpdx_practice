class EditDonationController {
    currentAccountList;

    constructor(
        contactsService, currentAccountList, donationsService,
        donationId
    ) {
        this.currentAccountList = currentAccountList;
        contactsService.getDonorAccounts();
        this.donorAccounts = contactsService.donorAccounts;
        this.donation = _.find(donationsService.data, { id: parseInt(donationId) });
        console.log(this.donation);
    }
}

export default angular.module('mpdx.donation.edit.controller', [])
    .controller('editDonationController', EditDonationController).name;