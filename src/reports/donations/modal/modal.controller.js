class DonationModalController {
    accounts;
    appeals;
    currency;
    donations;

    constructor(
        $scope, blockUI,
        appeals, currency, accounts, donations,
        donation, donorAccounts, designationAccounts
    ) {
        this.$scope = $scope;
        this.appeals = appeals;
        this.currency = currency;
        this.accounts = accounts;
        this.donations = donations;
        this.appeals = appeals;
        this.donation = donation;
        this.donorAccounts = donorAccounts;
        this.designationAccounts = designationAccounts;

        this.blockUI = blockUI.instances.get('donationModal');

        this.appealsList = [];
        this.appeals.getList().then((data) => {
            this.appealsList = data;
        });

        this.donorAccountsList = [];
        this.donorAccounts.getList().then((data) => {
            this.donorAccountsList = data;
        });

        this.designationAccountsList = [];
        this.designationAccounts.getList().then((data) => {
            this.designationAccountsList = data;
        });
    }

    save() {
        return this.donations.save(this.donation).then(() => {
            this.$scope.$hide();
        });
    }

    delete() {
        return this.donations.delete(this.donation).then(() => {
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.donation.modal.controller', [])
    .controller('donationModalController', DonationModalController).name;