import createPatch from 'common/fp/createPatch';
import { defaultTo, has } from 'lodash/fp';
import fixed from 'common/fp/fixed';

class DonationModalController {
    constructor(
        $rootScope, $scope, gettextCatalog,
        accounts, api, locale, donorAccounts, designationAccounts, modal, serverConstants,
        donation
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.accounts = accounts;
        this.api = api;
        this.donorAccounts = donorAccounts;
        this.designationAccounts = designationAccounts;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.modal = modal;
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
        this.donation.amount = fixed(2, defaultTo(0, this.donation.amount));

        if (!this.donation.motivation) {
            this.donation.motivation = '';
        }
    }
    setDesignationAccount() {
        return this.designationAccounts.load().then((data) => {
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
        const successMessage = this.gettextCatalog.getString('Donation saved successfully');
        const errorMessage = this.gettextCatalog.getString('Unable to save changes to donation');
        return this.getSavePromise(patch, successMessage, errorMessage).then(() => {
            this.$rootScope.$emit('donationUpdated', patch);
            this.$scope.$hide();
        });
    }
    getSavePromise(donation, successMessage, errorMessage) {
        if (has('amount', donation)) {
            donation.amount = donation.amount.replace(/[^\d.-]/g, '');
        }
        if (has('id', donation)) {
            return this.api.put(
                `account_lists/${this.api.account_list_id}/donations/${donation.id}`,
                donation, successMessage, errorMessage
            );
        }
        return this.api.post(
            `account_lists/${this.api.account_list_id}/donations`,
            donation, successMessage, errorMessage
        );
    }
    delete() {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected donation?');
        return this.modal.confirm(message).then(() => {
            const successMessage = this.gettextCatalog.getString('Donation deleted successfully');
            const errorMessage = this.gettextCatalog.getString('Unable to remove donation');
            return this.api.delete(
                `account_lists/${this.api.account_list_id}/donations/${this.donation.id}`,
                { id: this.donation.id },
                successMessage,
                errorMessage
            );
        }).then(() => {
            this.$rootScope.$emit('donationRemoved', { id: this.donation.id });
            this.$scope.$hide();
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
        this.donation.appeal_amount = appeal ? this.donation.appeal_amount : null;
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

import accounts from 'common/accounts/accounts.service';
import api from 'common/api/api.service';
import designationAccounts from 'common/designationAccounts/designationAccounts.service';
import donorAccounts from 'common/donorAccounts/donorAccounts.service';
import gettextCatalog from 'angular-gettext';
import locale from 'common/locale/locale.service';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.donation.modal.controller', [
    gettextCatalog,
    accounts, api, designationAccounts, donorAccounts, locale, modal, serverConstants
]).controller('donationModalController', DonationModalController).name;
