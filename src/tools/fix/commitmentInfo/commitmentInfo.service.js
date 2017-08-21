import concat from 'lodash/fp/concat';
import get from 'lodash/fp/get';
import isNil from 'lodash/fp/isNil';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';

class CommitmentInfoService {
    constructor(
        api, contacts, serverConstants, tools
    ) {
        this.api = api;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.tools = tools;

        this.loading = false;
        this.page = 1;
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
            this.setMeta(data.meta);

            this.data = reduce((result, contact) => {
                contact.original_pledge_amount = contact.pledge_amount;
                contact.original_pledge_currency = contact.pledge_currency;
                if (!isNil(contact.pledge_frequency)) {
                    const frequency = this.serverConstants.getPledgeFrequency(contact.pledge_frequency);
                    contact.original_pledge_frequency = get('value', frequency);
                }
                contact.original_status = contact.status;

                contact.pledge_amount = parseFloat(contact.suggested_changes.pledge_amount);

                if (!isNil(contact.suggested_changes.pledge_currency)) {
                    contact.pledge_currency = contact.suggested_changes.pledge_currency;
                }

                if (!isNil(contact.suggested_changes.pledge_frequency)) {
                    contact.pledge_frequency = parseFloat(contact.suggested_changes.pledge_frequency);
                }

                if (!isNil(contact.suggested_changes.status)) {
                    contact.status = contact.suggested_changes.status;
                }
                return concat(result, contact);
            }, [], angular.copy(data));

            this.loading = false;

            return this.data;
        });
    }

    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count && this.tools.analytics) {
            this.tools.analytics['fix-commitment-info'] = this.meta.pagination.total_count;
        }
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
            this.setMeta(this.meta);
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
import serverConstants from 'common/serverConstants/serverConstants.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.fix.commitmentInfo.service', [
    api, contacts, serverConstants, tools
]).service('fixCommitmentInfo', CommitmentInfoService).name;
