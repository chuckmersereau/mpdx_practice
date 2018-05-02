import { has } from 'lodash/fp';
import * as moment from 'moment';

export class DonationsService {
    chartData: any;
    constructor(
        private $log: ng.ILogService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService
    ) {}
    save(donation: any): ng.IPromise<any> {
        if (has('amount', donation)) {
            donation.amount = donation.amount.replace(/[^\d.-]/g, '');
        }
        if (has('id', donation)) {
            return this.api.put(`account_lists/${this.api.account_list_id}/donations/${donation.id}`, donation);
        } else {
            return this.api.post(`account_lists/${this.api.account_list_id}/donations`, donation);
        }
    }
    getDonations({ startDate = null, endDate = null, donorAccountId = null, page = null }: {
        startDate?: string | moment.Moment,
        endDate?: string | moment.Moment,
        donorAccountId?: string,
        page?: number
        } = {}): ng.IPromise<any> {
        let params: any = {
            fields: {
                pledge_contact: '',
                contacts: 'name',
                designation_account: 'display_name,designation_number',
                donor_account: 'display_name,account_number',
                appeal: 'name',
                pledge: 'contact'
            },
            filter: {},
            include: 'designation_account,donor_account,contact,appeal,pledge,pledge.contact',
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
    delete(donation: any): ng.IPromise<any> {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete the selected donation?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`account_lists/${this.api.account_list_id}/donations/${donation.id}`, { id: donation.id });
        });
    }
    displayName(donation: any): string {
        if (donation.contact) {
            return `${donation.contact.name} (${donation.donor_account.account_number})`;
        } else {
            return donation.donor_account.display_name;
        }
    }
    openDonationModal(donation: any = {}): ng.IPromise<any> {
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

import 'angular-gettext';
import api, { ApiService } from '../../common/api/api.service';
import modal, { ModalService } from '../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.reports.donations.service', [
    'gettext',
    api, modal, serverConstants
]).service('donations', DonationsService).name;
