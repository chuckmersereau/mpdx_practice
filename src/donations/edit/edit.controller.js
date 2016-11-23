class EditDonationController {
    currentAccountList;

    constructor(
        contactsService, currentAccountList, donationsService,
        donationId
    ) {
        this.currentAccountList = currentAccountList;
        this.donationId = donationId;
        contactsService.getDonorAccounts();
        this.donorAccounts = contactsService.donorAccounts;
        if (donationsService.data === null) {
            donationsService.getDonations().then((data) => {
                this.loadingFinished(data);
            });
        } else {
            this.loadingFinished(donationsService.data);
        }
    }
    loadingFinished(data) {
        this.donation = _.find(data.donations, { id: parseInt(this.donationId) });
        console.log(this.donation);
    }
}

export default angular.module('mpdx.donation.edit.controller', [])
    .controller('editDonationController', EditDonationController).name;