import has from 'lodash/fp/has';
import moment from 'moment';

class DonationsService {
    api;
    modal;

    constructor(
        $log, gettextCatalog,
        api, modal
    ) {
        this.$log = $log;
        this.gettextCatalog = gettextCatalog;
        this.api = api;
        this.modal = modal;
    }

    getDonations({ startDate = null, endDate = null, donorAccountId = null, page = null } = {}) {
        let params = {
            fields: {
                contacts: 'name',
                designation_account: 'display_name,designation_number',
                donor_account: 'display_name,account_number',
                appeal: 'name'
            },
            filter: {},
            include: 'designation_account,donor_account,contact,appeal',
            sort: '-donation_date'
        };
        if (donorAccountId) {
            params.filter.donor_account_id = donorAccountId;
        }
        if (page) {
            params.page = page;
        }
        if (startDate && endDate && moment.isMoment(startDate) && moment.isMoment(endDate)) {
            params.filter.donation_date = `${startDate.format('YYYY-MM-DD')}..${endDate.format('YYYY-MM-DD')}`;
        }
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`, params).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/donations`, data);
            return data;
        });
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

    getDonationChart({ startDate = null, endDate = null, donorAccountId = null } = {}) {
        let params = {
            filter: {
                account_list_id: this.api.account_list_id
            }
        };
        if (donorAccountId) {
            params.filter.donor_account_id = donorAccountId;
        }
        if (startDate && endDate && moment.isMoment(startDate) && moment.isMoment(endDate)) {
            params.filter.donation_date = `${startDate.format('YYYY-MM-DD')}..${endDate.format('YYYY-MM-DD')}`;
        }
        return this.api.get('reports/monthly_giving_graph', params).then((data) => {
            this.$log.debug('reports/monthly_giving_graph', data);
            return data;
        });
    }

    openDonationModal(donation) {
        if (!donation) {
            donation = { amount: '0' };
        }
        return this.modal.open({
            template: require('./modal/modal.html'),
            controller: 'donationModalController',
            locals: {
                donation: angular.copy(donation)
            }
        });
    }
}

import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.reports.donations.service', [
    gettextCatalog,
    api, modal
]).service('donations', DonationsService).name;
