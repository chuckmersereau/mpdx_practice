import createPatch from 'common/fp/createPatch';

class DonationModalController {
    constructor(
        $scope, gettextCatalog,
        accounts, api, alerts, donations, locale, donorAccounts, designationAccounts, serverConstants,
        donation
    ) {
        this.$scope = $scope;

        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.donations = donations;
        this.donorAccounts = donorAccounts;
        this.designationAccounts = designationAccounts;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.serverConstants = serverConstants;

        this.initialDonation = donation;
        this.donation = angular.copy(donation);

        this.activate();
    }

    activate() {
        if (!this.donation.designation_account) {
            this.setDesignationAccount();
        }

        if (!this.donation.currency && this.accounts.current.currency) {
            this.donation.currency = this.accounts.current.currency;
        }
    }

    setDesignationAccount() {
        return this.designationAccounts.load().then(data => {
            if (data.length === 1) {
                this.donation.designation_account = data[0];
            }
        });
    }

    save() {
        let donation = angular.copy(this.donation);

        if (this.initialDonation.appeal && !donation.appeal) { // appeal removed case
            donation.appeal = { id: 'none' }; // fudge around api shortcoming
        }
        const patch = createPatch(this.initialDonation, donation);
        return this.donations.save(patch).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Donation saved successfullly'), 'success');
            this.$scope.$hide();
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes to donation'), 'danger', null, 5, true);
            throw err;
        });
    }

    delete() {
        return this.donations.delete(this.donation).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Donation deleted successfullly'), 'success');
            this.$scope.$hide();
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to remove donation'), 'danger', null, 5, true);
            throw err;
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

    search(keywords) {
        return this.api.get('appeals', {
            filter: {
                wildcard_search: keywords,
                account_list_id: this.api.account_list_id
            },
            fields: {
                appeals: 'name'
            },
            sort: '-created_at',
            per_page: 6
        });
    }
}

import gettextCatalog from 'angular-gettext';
import accounts from 'common/accounts/accounts.service';
import api from 'common/api/api.service';
import alerts from 'common/alerts/alerts.service';
import donations from 'reports/donations/donations.service';
import locale from 'common/locale/locale.service';
import donorAccounts from 'common/donorAccounts/donorAccounts.service';
import designationAccounts from 'common/designationAccounts/designationAccounts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.donation.modal.controller', [
    gettextCatalog,
    accounts, api, alerts, donations, locale, donorAccounts, designationAccounts, serverConstants
]).controller('donationModalController', DonationModalController).name;
