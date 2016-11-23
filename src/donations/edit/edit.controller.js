class EditDonationController {
    appealsService;
    currencyService;
    currentAccountList;
    donationsService;

    constructor(
        $scope, blockUI,
        appealsService, contactsService, currencyService, currentAccountList, donationsService,
        donationId
    ) {
        this.$scope = $scope;
        this.appealsService = appealsService;
        this.currencyService = currencyService;
        this.currentAccountList = currentAccountList;
        this.donationsService = donationsService;
        this.donationId = donationId;

        this.blockUI = blockUI.instances.get('donationEdit');
        this.blockUI.start();

        contactsService.getDonorAccounts();
        this.donorAccounts = contactsService.donorAccounts;

        if (donationId === 'new') {
            this.blockUI.stop();
            return;
        }
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
    }
    submit(donation) {
        this.donationsService.save(donation).then(() => {
            this.donationsService.data = null;
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.donation.edit.controller', [])
    .controller('editDonationController', EditDonationController).name;