const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import each from 'lodash/fp/each';
import unionBy from 'lodash/fp/unionBy';
import isEmpty from 'lodash/fp/isEmpty';

class FixMailingAddressService {
    api;
    blockUI;

    constructor(
        $log, $q, blockUI,
        api, contacts
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;
        this.contacts = contacts;
        this.blockUI = blockUI.instances.get('fix-mailing-address');

        this.loading = true;
        this.page = 1;
        this.perPage = 25;
        this.meta = {};
        this.data = [];
    }

    load(reset = false, page = 1) {
        this.loading = true;

        if (reset) {
            this.page = 1;
            this.meta = {};
            this.data = [];
        }

        this.blockUI.start();
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {address_valid: false},
                include: 'addresses',
                page: page,
                per_page: this.perPage
            }
        }).then((data) => {
            this.$log.debug('FixMailingAddress');
            this.$log.debug(data);

            this.blockUI.stop();

            if (data.length === 0) {
                this.loading = false;
                return;
            }
            const newContacts = reduce((result, contact) => {
                result.push(contact);
                return result;
            }, [], data);

            _.each(data, (contact) => {
                contact.addresses.push({source: 'MPDX', new: true});
            });

            if (reset) {
                this.data = newContacts;
            } else {
                this.data = unionBy('id', this.data, newContacts);
            }

            this.meta = data.meta;
            this.perPage = data.meta.pagination.per_page;
            this.page = data.meta.pagination.page;

            this.loading = false;
        });
    }

    loadCount() {
        if (isEmpty(this.meta)) {
            this.load(true, 1);
        }
    }

    loadAll() {
        let promise = this.$q.defer();

        this.api.get({
            url: 'contacts',
            data: {
                filters: {address_valid: false},
                include: 'addresses',
                page: 1,
                per_page: 20000
            }
        }).then((data) => {
            this.$log.debug('FixMailingAddress.loadAll');
            this.$log.debug(data);

            promise.resolve(data);
        });

        return promise.promise;
    }

    loadMore() {
        if (this.loading || this.page >= this.meta.pagination.total_pages) {
            return;
        }
        this.page++;
        this.load(false, this.page);
    }

    bulkSave(primarySource) {
        this.page = 1;
        this.meta = {};
        this.data = [];
        this.blockUI.start();

        let promise = this.$q.defer();
        let promises = [];

        this.loadAll().then((contacts) => {
            each((contact) => {
                let primary = false;

                each((address) => {
                    address.valid_values = true;
                    address.primary_mailing_address = false;
                    if (!primary && address.source === primarySource) {
                        address.primary_mailing_address = true;
                        primary = true;
                    }
                }, contact.addresses);

                if (primary) {
                    each((address) => {
                        let addressPromise = this.$q.defer();
                        promises.push(addressPromise.promise);

                        this.contacts.saveAddress(contact.id, address).then(() => {
                            this.$log.debug('FixMailingAddress.bulkSave: address saved');
                            addressPromise.resolve();
                        });
                    }, contact.addresses);
                }
            }, contacts);

            this.$q.all(promises).then(() => {
                this.$log.debug('FixMailingAddress.bulkSave: all promises completed');
                this.blockUI.stop();

                promise.resolve();
            });
        });

        return promise.promise;
    }

    deleteAddress(contact, address) {
        return this.api.delete(`contacts/${contact.id}/addresses/${address.id}`);
    }
}

export default angular.module('mpdx.tools.fixMailingAddress.service', [])
    .service('fixMailingAddress', FixMailingAddressService).name;
