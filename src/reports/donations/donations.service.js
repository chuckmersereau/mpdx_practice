import has from 'lodash/fp/has';

class DonationsService {
    api;
    modal;
    session;

    constructor(
        $q, $log, $state,
        api, modal
    ) {
        this.$q = $q;
        this.$log = $log;
        this.$state = $state;
        this.api = api;
        this.modal = modal;
    }

    getDonations({ startDate = null, endDate = null, contactId = null, page = null }) {
        let params = {
            fields: { contacts: 'name', designation_account: 'name,designation_number', donor_account: 'account_number', appeal: 'name' },
            filter: {},
            include: 'designation_account,donor_account,contact,appeal',
            sort: 'created_at'
        };
        if (contactId) {
            params.filter.contactId = contactId;
        }
        if (page) {
            params.page = page;
        }
        if (startDate && endDate) {
            params.filter.donation_date = `${startDate.format('YYYY-MM-DD')}..${endDate.format('YYYY-MM-DD')}`;
        }
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`, params).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/donations`, data);
            return data;
        });
    }

    getDonation(donationId) {
        let params = {
            include: 'donor_account,designation_account,appeal',
            fields: {donor_account: 'id', designation_account: 'id', appeal: 'id'}
        };
        return this.api.get(`account_lists/${this.api.account_list_id}/donations/${donationId}`, params).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/donations/${donationId}`, data);
            return data;
        });
    }

    getDonationsGraphForContact(contactId) {
        return this.api.get(`contacts/${contactId}/donations/graph`);
    }

    save(donation) {
        donation.amount = donation.amount.replace(/[^\d.-]/g, '');
        if (has('id', donation)) {
            return this.api.put(`account_lists/${this.api.account_list_id}/donations/${donation.id}`, donation);
        } else {
            return this.api.post(`account_lists/${this.api.account_list_id}/donations`, donation);
        }
    }

    delete(donation) {
        return this.api.delete(`account_lists/${this.api.account_list_id}/donations/${donation.id}`, { id: donation.id });
    }

    openNewDonationModal() {
        return this.openDonationModal({ amount: '0' });
    }

    openDonationModal(donation) {
        return this.modal.open({
            template: require('./modal/modal.html'),
            controller: 'donationModalController',
            locals: {
                donation: angular.copy(donation)
            }
        });
    }
}
export default angular.module('mpdx.reports.donations.service', [])
    .service('donations', DonationsService).name;
