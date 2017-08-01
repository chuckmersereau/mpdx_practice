import each from 'lodash/fp/each';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';

class CommitmentInfoService {
    constructor(
        api, contacts
    ) {
        this.api = api;
        this.contacts = contacts;
        this.loading = false;
        this.page = 1;
    }

    loadCount() {
        if (this.meta) { return Promise.resolve(this.meta); }
        return this.api.get(
            'contacts',
            {
                filter: {
                    status_valid: false,
                    account_list_id: this.api.account_list_id
                },
                page: 1,
                per_page: 0
            }
        ).then((data) => {
            if (!this.meta) {
                this.meta = data.meta;
            }
            return this.meta;
        });
    }

    load(reset = false, page = 1) {
        if (!reset && this.data && this.page === page) {
            return Promise.resolve(this.data);
        }

        this.loading = true;
        this.page = page;

        return this.api.get(
            'contacts',
            {
                filter: {
                    status_valid: false,
                    account_list_id: this.api.account_list_id
                },
                fields: {
                    contact: 'status,pledge_currency,pledge_frequency,pledge_amount,name,avatar,suggested_changes,last_six_donations'
                },
                include: 'last_six_donations',
                sort: 'name',
                page: page,
                per_page: 5
            }
        ).then((data) => {
            this.loading = false;

            this.data = data;
            this.meta = data.meta;

            each((contact) => {
                contact.original_pledge_amount = contact.pledge_amount;
                contact.original_pledge_currency = contact.pledge_currency;
                contact.original_pledge_frequency = contact.pledge_frequency;
                contact.original_status = contact.status;

                if (contact.suggested_changes.hasOwnProperty('pledge_amount')) {
                    contact.pledge_amount = contact.suggested_changes['pledge_amount'];
                }

                contact.pledge_amount = parseFloat(contact.pledge_amount);

                if (contact.suggested_changes.hasOwnProperty('pledge_currency')) {
                    contact.pledge_currency = contact.suggested_changes['pledge_currency'];
                }

                if (contact.suggested_changes.hasOwnProperty('pledge_frequency')) {
                    contact.pledge_frequency = contact.suggested_changes['pledge_frequency'];
                }

                if (contact.suggested_changes.hasOwnProperty('status')) {
                    contact.status = contact.suggested_changes['status'];
                }
            }, data);

            return this.data;
        });
    }

    save(contact) {
        contact.status_valid = true;
        return this.contacts.save(contact).then(() => this.removeContactFromData(contact.id));
    }

    reject(contact) {
        const params = {
            id: contact.id,
            status_valid: true
        };
        return this.contacts.save(params).then(() => this.removeContactFromData(contact.id));
    }

    removeContactFromData(contactId) {
        this.data = reject({ id: contactId }, this.data);
        if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
            this.meta.pagination.total_count -= 1;
        }
        if (this.data.length === 0) {
            this.load(true, this.page);
        }
    }

    bulkSave() {
        let contacts = reduce((result, contact) => {
            contact.status_valid = true;
            result.push(contact);
            return result;
        }, [], this.data);

        return this.contacts.bulkSave(contacts).then(() => {
            return this.load(true);
        });
    }
}

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';

export default angular.module('mpdx.tools.fix.commitmentInfo.service', [
    api, contacts
]).service('fixCommitmentInfo', CommitmentInfoService).name;
