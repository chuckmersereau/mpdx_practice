import { has } from 'lodash/fp';

class DonationsService {
    constructor(
        $log, gettextCatalog,
        api, modal, serverConstants
    ) {
        this.$log = $log;
        this.gettextCatalog = gettextCatalog;
        this.api = api;
        this.modal = modal;
        this.serverConstants = serverConstants;
    }
    save(donation) {
        if (has('amount', donation)) {
            donation.amount = donation.amount.replace(/[^\d.-]/g, '');
        }
        if (has('id', donation)) {
            return this.api.put(`account_lists/${this.api.account_list_id}/donations/${donation.id}`, donation);
        } else {
            return this.api.post(`account_lists/${this.api.account_list_id}/donations`, donation);
        }
    }
    delete(donation) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected donation?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`account_lists/${this.api.account_list_id}/donations/${donation.id}`, { id: donation.id });
        });
    }
    displayName(donation) {
        if (donation.contact) {
            return `${donation.contact.name} (${donation.donor_account.account_number})`;
        } else {
            return donation.donor_account.display_name;
        }
    }
    openDonationModal(donation) {
        if (!donation) {
            donation = {};
        }
        return this.modal.open({
            template: require('./modal/modal.html'),
            controller: 'donationModalController',
            locals: {
                donation: angular.copy(donation)
            },
            resolve: {
                0: () => this.serverConstants.load(['pledge_currencies'])
            }
        });
    }
}

import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.reports.donations.service', [
    gettextCatalog,
    api, modal, serverConstants
]).service('donations', DonationsService).name;
