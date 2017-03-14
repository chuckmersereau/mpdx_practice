class DonationModalController {
    accounts;
    appeals;
    currency;
    designationAccounts;
    donations;
    donorAccounts;
    serverConstants;

    constructor(
        $scope, blockUI,
        appeals, accounts, donations,
        donation, donorAccounts, designationAccounts, serverConstants
    ) {
        this.$scope = $scope;
        this.appeals = appeals;
        this.accounts = accounts;
        this.donations = donations;
        this.appeals = appeals;
        this.donation = donation;
        this.donorAccounts = donorAccounts;
        this.designationAccounts = designationAccounts;
        this.serverConstants = serverConstants;

        this.blockUI = blockUI.instances.get('donationModal');

        this.appeals.getList();
        this.donorAccounts.getList();
        this.designationAccounts.getList();
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
