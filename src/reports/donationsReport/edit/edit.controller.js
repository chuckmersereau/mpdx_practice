class EditDonationController {
    accounts;
    appeals;
    currency;
    donationsReportService;

    constructor(
        $scope, blockUI,
        appeals, contactsService, currency, accounts, donationsReportService,
        donationId
    ) {
        this.$scope = $scope;
        this.appeals = appeals;
        this.currency = currency;
        this.accounts = accounts;
        this.donationsReportService = donationsReportService;
        this.donationId = donationId;

        this.blockUI = blockUI.instances.get('donationEdit');
        this.blockUI.start();

        contactsService.getDonorAccounts();
        this.donorAccounts = contactsService.donorAccounts;

        if (donationId === 'new') {
            this.blockUI.stop();
            return;
        }
        if (accounts.data === null) {
            accounts.getDonations().then((data) => {
                this.loadingFinished(data);
            });
        } else {
            this.loadingFinished(donationsReportService.data);
        }
    }
    loadingFinished(data) {
        this.donation = _.find(data.donations, { id: parseInt(this.donationId) });
        this.blockUI.stop();
    }
    submit(donation) {
        this.donationsReportService.save(donation).then(() => {
            this.donationsReportService.data = null;
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.donation.edit.controller', [])
    .controller('editDonationController', EditDonationController).name;
