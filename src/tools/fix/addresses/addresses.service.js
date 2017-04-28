import each from 'lodash/fp/each';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import reject from 'lodash/fp/reject';
import uniq from 'lodash/fp/uniq';

class AddressesService {
    api;
    blockUI;

    constructor(
        $log, $q, $rootScope,
        api, contacts
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;
        this.contacts = contacts;
        this.loading = false;
        this.page = 1;

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }

    loadCount() {
        if (this.meta) { return this.$q.resolve(); }
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    address_valid: false,
                    account_list_id: this.api.account_list_id
                },
                page: 1,
                per_page: 0
            }
        }).then((data) => {
            if (!this.meta) {
                this.meta = data.meta;
            }
        });
    }

    load(reset = false, page = 1) {
        if (!reset && this.data && this.page === page) {
            return this.$q.resolve(this.data);
        }

        this.loading = true;
        this.page = page;

        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    address_valid: false,
                    account_list_id: this.api.account_list_id
                },
                fields: {
                    contacts: 'name,avatar,addresses'
                },
                include: 'addresses',
                page: this.page,
                per_page: 25,
                sort: 'name'
            }
        }).then((data) => {
            this.$log.debug('FixAddresses.load', data);
            this.loading = false;

            this.sources = ['MPDX'];
            this.data = data;
            each((contact) => {
                each((address) => {
                    this.sources.push(address.source);
                }, contact.addresses);
            }, data);
            this.sources = uniq(this.sources).sort();

            this.meta = data.meta;
        });
    }

    save(contact) {
        contact.addresses = each((address) => {
            address.valid_values = true;
        }, contact.addresses);

        return this.contacts.save(contact).then(() => {
            this.data = reject({ id: contact.id }, this.data);
            if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
                this.meta.pagination.total_count -= 1;
            }
        });
    }

    bulkSave(source) {
        let contacts = reduce((result, contact) => {
            let primaryAddress = find(['source', source], contact.addresses);
            if (primaryAddress) {
                contact.addresses = map(address => {
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
        contact.addresses = map(address => {
            address.primary_mailing_address = address.id === primaryAddress.id;
            return address;
        }, contact.addresses);
    }

    remove(contact, address) {
        this.contacts.deleteAddress(contact.id, address.id).then(() => {
            contact.addresses = reject({id: address.id}, contact.addresses);
        });
    }
}

export default angular.module('mpdx.tools.fix.addresses.service', [])
    .service('fixAddresses', AddressesService).name;
