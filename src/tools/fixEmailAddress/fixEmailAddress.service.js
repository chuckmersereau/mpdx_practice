import uuid from 'uuid/v1';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import each from 'lodash/fp/each';
import unionBy from 'lodash/fp/unionBy';
import isEmpty from 'lodash/fp/isEmpty';

class FixEmailAddressService {
    api;
    blockUI;

    constructor(
        $log, $q, blockUI,
        api, people
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;
        this.people = people;
        this.blockUI = blockUI.instances.get('fix-email-address');

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
            url: `contacts/people`,
            data: {
                filter: {email_address_valid: false},
                include: 'email_addresses',
                page: page,
                per_page: this.perPage
            }
        }).then((data) => {
            this.$log.debug('FixEmailAddress');
            this.$log.debug(data);

            this.blockUI.stop();

            if (data.length === 0) {
                this.loading = false;
                return;
            }
            const newPeople = reduce((result, person) => {
                result.push(person);
                return result;
            }, [], data);

            _.each(data, (person) => {
                person.email_addresses.push({id: uuid(), source: 'MPDX', new: true});
            });

            if (reset) {
                this.data = newPeople;
            } else {
                this.data = unionBy('id', this.data, newPeople);
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
            url: 'contacts/people',
            data: {
                filters: {email_address_valid: false},
                include: 'email_addresses',
                page: 1,
                per_page: 20000
            }
        }).then((data) => {
            this.$log.debug('FixEmailAddress.loadAll');
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

        this.loadAll().then((people) => {
            each((person) => {
                let primary = false;

                each((email) => {
                    email.valid_values = true;
                    email.primary = false;
                    if (!primary && email.source === primarySource) {
                        email.primary = true;
                        primary = true;
                    }
                }, person.email_addresses);

                if (primary) {
                    let personPromise = this.$q.defer();
                    promises.push(personPromise.promise);

                    this.people.save(null, person).then(() => {
                        this.$log.debug('FixEmailAddress.bulkSave: person saved');
                        personPromise.resolve();
                    });
                }
            }, people);

            this.$q.all(promises).then(() => {
                this.$log.debug('FixEmailAddress.bulkSave: all promises completed');
                this.blockUI.stop();

                promise.resolve();
            });
        });

        return promise.promise;
    }
}

export default angular.module('mpdx.tools.fixEmailAddress.service', [])
    .service('fixEmailAddress', FixEmailAddressService).name;
