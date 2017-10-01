import each from 'lodash/fp/each';
import filter from 'lodash/fp/filter';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import uniq from 'lodash/fp/uniq';

class AddressesService {
    constructor(
        api, contacts, tools
    ) {
        this.api = api;
        this.contacts = contacts;
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
                    address_valid: false,
                    account_list_id: this.api.account_list_id,
                    deceased: false
                },
                fields: {
                    contacts: 'name,avatar,addresses'
                },
                include: 'addresses',
                page: this.page,
                per_page: 25,
                sort: 'name'
            }
        ).then((data) => {
            this.loading = false;

            this.sources = ['MPDX'];
            each((contact) => {
                each((address) => {
                    this.sources.push(address.source);
                }, contact.addresses);
            }, data);
            this.sources = uniq(this.sources).sort();
            this.data = data;
            this.setMeta(data.meta);

            return this.data;
        });
    }

    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['fix-addresses'] = this.meta.pagination.total_count;
        }
    }

    save(contact) {
        contact.addresses = each((address) => {
            address.valid_values = true;
        }, contact.addresses);

        return this.contacts.save(contact).then(() => {
            this.data = reject({ id: contact.id }, this.data);
            if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
                this.meta.pagination.total_count -= 1;
                this.setMeta(this.meta);
            }
            if (this.data.length === 0) {
                this.load(true, this.page);
            }
        });
    }

    bulkSave(source) {
        let contacts = reduce((result, contact) => {
            let primaryAddress = find(['source', source], contact.addresses);
            if (primaryAddress) {
                contact.addresses = map((address) => {
                    address.primary_mailing_address = address.id === primaryAddress.id;
                    address.valid_values = true;
                    return address;
                }, contact.addresses);
                result.push(contact);
            }
            return result;
        }, [], this.data);

        return this.contacts.bulkSave(contacts).then(() => {
            return this.load(true);
        });
    }

    setPrimary(contact, primaryAddress) {
        contact.addresses = map((address) => {
            address.primary_mailing_address = address.id === primaryAddress.id;
            return address;
        }, contact.addresses);
    }

    removeAddress(contact, address) {
        return this.contacts.deleteAddress(contact.id, address.id).then(() => {
            contact.addresses = reject({ id: address.id }, contact.addresses);
        });
    }

    hasPrimary(contact) {
        return filter((address) => address.primary_mailing_address, contact.addresses).length === 1;
    }
}

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.fix.addresses.service', [
    api, contacts, tools
]).service('fixAddresses', AddressesService).name;