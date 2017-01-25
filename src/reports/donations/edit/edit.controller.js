class EditDonationController {
    accounts;
    appeals;
    currency;
    donationsReport;

    constructor(
        $scope, blockUI,
        appeals, contacts, currency, accounts, donationsReport,
        donationId
    ) {
        this.$scope = $scope;
        this.appeals = appeals;
        this.currency = currency;
        this.accounts = accounts;
        this.donationsReport = donationsReport;
        this.donationId = donationId;

        this.blockUI = blockUI.instances.get('donationEdit');
        this.blockUI.start();

        contacts.getDonorAccounts();
        this.donorAccounts = contacts.donorAccounts;

        if (donationId === 'new') {
            this.blockUI.stop();
            return;
        }
        if (accounts.data === null) {
            accounts.getDonations().then((data) => {
                this.loadingFinished(data);
            });
        } else {
            this.loadingFinished(donationsReport.data);
        }
    }
    loadingFinished(data) {
        this.donation = _.find(data.donations, { id: parseInt(this.donationId) });
        this.blockUI.stop();
    }
    save() {
        return this.donationsReport.save(this.donation).then(() => {
            this.donationsReport.data = null;
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.donation.edit.controller', [])
    .controller('editDonationController', EditDonationController).name;
