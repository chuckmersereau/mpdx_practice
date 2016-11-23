class EditDonationController {
    currencyService;
    currentAccountList;

    constructor(
        blockUI,
        contactsService, currencyService, currentAccountList, donationsService,
        donationId
    ) {
        this.currencyService = currencyService;
        this.currentAccountList = currentAccountList;
        this.donationId = donationId;

        this.blockUI = blockUI.instances.get('donationEdit');
        this.blockUI.start();

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
        this.blockUI.stop();
        console.log(this.donation);
    }
}

export default angular.module('mpdx.donation.edit.controller', [])
    .controller('editDonationController', EditDonationController).name;