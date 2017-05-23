import createPatch from 'common/fp/createPatch';

class DonationModalController {
    appeals;
    alerts;
    donations;
    locale;
    donorAccounts;
    designationAccounts;
    serverConstants;

    constructor(
        $scope, gettextCatalog,
        appeals, alerts, donations, locale, donorAccounts, designationAccounts, serverConstants,
        donation
    ) {
        this.$scope = $scope;

        this.alerts = alerts;
        this.appeals = appeals;
        this.donations = donations;
        this.donorAccounts = donorAccounts;
        this.designationAccounts = designationAccounts;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.serverConstants = serverConstants;

        this.initialDonation = donation;
        this.donation = angular.copy(donation);
    }

    save() {
        let donation = angular.copy(this.donation);

        if (this.initialDonation.appeal && !donation.appeal) { //appeal removed case
            donation.appeal = { id: 'none' }; //fudge around api shortcoming
        }
        const patch = createPatch(this.initialDonation, donation);
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

    onDonorAccountSelected(donorAccount) {
        this.donation.donor_account = donorAccount;
    }

    onDesignationAccountSelected(designationAccount) {
        this.donation.designation_account = designationAccount;
    }

    onAppealSelected(appeal) {
        this.donation.appeal = appeal;
    }
}

import gettextCatalog from 'angular-gettext';
import appeals from 'common/appeals/appeals.service';
import alerts from 'common/alerts/alerts.service';
import donations from 'reports/donations/donations.service';
import locale from 'common/locale/locale.service';
import donorAccounts from 'common/donorAccounts/donorAccounts.service';
import designationAccounts from 'common/designationAccounts/designationAccounts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.donation.modal.controller', [
    gettextCatalog,
    appeals, alerts, donations, locale, donorAccounts, designationAccounts, serverConstants
]).controller('donationModalController', DonationModalController).name;
