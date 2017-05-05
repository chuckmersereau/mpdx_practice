import createPatch from '../../../common/fp/createPatch';

class DonationModalController {
    accounts;
    appeals;
    designationAccounts;
    donations;
    donorAccounts;
    serverConstants;

    constructor(
        $scope, blockUI, gettextCatalog,
        appeals, accounts, alerts, donations, locale,
        donation, donorAccounts, designationAccounts, serverConstants
    ) {
        this.$scope = $scope;
        this.accounts = accounts;
        this.alerts = alerts;
        this.appeals = appeals;
        this.donations = donations;
        this.donorAccounts = donorAccounts;
        this.designationAccounts = designationAccounts;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.serverConstants = serverConstants;

        this.blockUI = blockUI.instances.get('donationModal');
        this.donation = angular.copy(donation);
        this.donationInitialState = angular.copy(donation);

        this.appeals.getList();
        this.donorAccounts.getList();
        this.designationAccounts.getList();
    }

    save() {
        if (this.donationInitialState.appeal && !this.donation.appeal) { //appeal removed case
            this.donation.appeal = {id: 'none'}; //fudge around api shortcoming
        }
        const patch = createPatch(this.donationInitialState, this.donation);
        return this.donations.save(patch).then(() => {
            this.$scope.$hide();
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to change donation'), 'danger');
        });
    }

    delete() {
        return this.donations.delete(this.donation).then(() => {
            this.$scope.$hide();
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to remove donation'), 'danger');
        });
    }
}

export default angular.module('mpdx.donation.modal.controller', [])
    .controller('donationModalController', DonationModalController).name;
