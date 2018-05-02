import { assign, concat, defaultTo, reduce, reject } from 'lodash/fp';

export class FixCommitmentInfoService {
    data: any;
    loading: boolean;
    meta: any;
    page: number;
    constructor(
        private $q: ng.IQService,
        private api: ApiService,
        private contacts: ContactsService,
        private serverConstants: ServerConstantsService,
        private tools: ToolsService
    ) {
        this.loading = false;
        this.page = 1;
    }
    load(reset: boolean = false, page: number = 1): ng.IPromise<any> {
        if (!reset && this.data && this.page === page) {
            return this.$q.resolve(this.data);
        }

        this.loading = true;
        this.page = page;

        return this.api.get(
            'contacts',
            {
                filter: {
                    status_valid: false,
                    account_list_id: this.api.account_list_id,
                    deceased: false
                },
                fields: {
                    contact: 'status,pledge_currency,pledge_frequency,pledge_amount,name,avatar,suggested_changes,last_six_donations'
                },
                include: 'last_six_donations',
                sort: 'name',
                page: page,
                per_page: 5
            }
        ).then((data: any) => {
            this.setMeta(data.meta);
            this.data = this.mutateContacts(data);
            this.loading = false;
            return this.data;
        });
    }
    private mutateContacts(data: any): any[] {
        return reduce((result, contact) => {
            return concat(result, assign(contact, {
                original_pledge_amount: contact.pledge_amount,
                original_pledge_currency: contact.pledge_currency,
                original_status: contact.status,
                original_pledge_frequency: this.serverConstants.getPledgeFrequencyValue(contact.pledge_frequency),
                pledge_amount: parseFloat(defaultTo(contact.pledge_amount, contact.suggested_changes.pledge_amount)),
                pledge_currency: defaultTo(contact.pledge_currency, contact.suggested_changes.pledge_currency),
                status: defaultTo(contact.status, contact.suggested_changes.status),
                pledge_frequency: defaultTo(contact.pledge_frequency, contact.suggested_changes.pledge_frequency)
            }));
        }, [], data);
    }
    private setMeta(meta: any): void {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['fix-commitment-info'] = this.meta.pagination.total_count;
        }
    }
    save(contact: any): ng.IPromise<any> {
        contact.status_valid = true;
        return this.contacts.save(contact).then(() => this.removeContactFromData(contact.id));
    }
    reject(contact: any): ng.IPromise<any> {
        const params = {
            id: contact.id,
            status_valid: true
        };
        return this.contacts.save(params).then(() => this.removeContactFromData(contact.id));
    }
    private removeContactFromData(contactId: string): void {
        this.data = reject({ id: contactId }, this.data);
        if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
            this.meta.pagination.total_count -= 1;
            this.setMeta(this.meta);
        }
        if (this.data.length === 0) {
            this.load(true, this.page);
        }
    }
    bulkSave(): ng.IPromise<any> {
        let contacts = reduce((result, contact) => {
            contact.status_valid = true;
            return concat(result, contact);
        }, [], this.data);

        return this.contacts.bulkSave(contacts).then(() => {
            return this.load(true);
        });
    }
}

import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tools, { ToolsService } from '../../tools.service';

export default angular.module('mpdx.tools.fix.commitmentInfo.service', [
    api, contacts, serverConstants, tools
]).service('fixCommitmentInfo', FixCommitmentInfoService).name;
