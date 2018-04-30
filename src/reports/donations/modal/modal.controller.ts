import createPatch from '../../../common/fp/createPatch';
import { defaultTo, get, has } from 'lodash/fp';
import fixed from '../../../common/fp/fixed';

class DonationModalController {
    donation: any;
    initialDonation: any;
    originalAppealId: string;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private appeals: AppealsService,
        private api: ApiService,
        private locale: LocaleService,
        private donorAccounts: DonorAccountsService,
        private designationAccounts: DesignationAccountsService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService,
        donation
    ) {
        this.initialDonation = donation;
        this.donation = angular.copy(donation);
        this.originalAppealId = get('id', donation.appeal);

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
        const originalAppealId = angular.copy(this.originalAppealId);
        if (this.initialDonation.appeal && !donation.appeal) { // appeal removed case
            donation.appeal = { id: 'none' }; // fudge around api shortcoming
        }
        const patch = createPatch(this.initialDonation, donation);
        const successMessage = this.gettextCatalog.getString('Donation saved successfully');
        const errorMessage = this.gettextCatalog.getString('Unable to save changes to donation');
        return this.getSavePromise(patch, successMessage, errorMessage).then(() => {
            this.$rootScope.$emit('donationUpdated', patch);
            this.$scope.$hide();
            if (get('id', donation.appeal) === 'none') {
                this.removePledgeThenContact(donation, originalAppealId);
            }
        });
    }
    removePledgeThenContact(donation, originalAppealId) {
        if (get('id', get('pledge', donation))) {
            const pledgeMsg = this.gettextCatalog.getString('Would you also like to remove the associated commitment from the appeal?');
            return this.modal.confirm(pledgeMsg).then(() =>
                this.appeals.removePledge(donation.pledge.id).then(() =>
                    this.removeContact(donation, originalAppealId))
            );
        }
    }
    removeContact(donation, originalAppealId) {
        const msg = this.gettextCatalog.getString('Would you like to also remove the contact from the the appeal?');
        return this.modal.confirm(msg).then(() =>
            this.appeals.removeContact(originalAppealId, donation.contact.id)
        );
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
        let donation = angular.copy(this.donation);
        const originalAppealId = angular.copy(this.originalAppealId);
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
            return this.removePledgeThenContact(donation, originalAppealId);
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

import 'angular-gettext';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import appeals, { AppealsService } from '../../../tools/appeals/appeals.service';
import api, { ApiService } from '../../../common/api/api.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';
import designationAccounts, { DesignationAccountsService } from '../../../common/designationAccounts/designationAccounts.service';
import donorAccounts, { DonorAccountsService } from '../../../common/donorAccounts/donorAccounts.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';


export default angular.module('mpdx.donation.modal.controller', [
    'gettext',
    accounts, appeals, api, designationAccounts, donorAccounts, locale, modal, serverConstants
]).controller('donationModalController', DonationModalController).name;
