import each from 'lodash/fp/each';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import reject from 'lodash/fp/reject';
import uniq from 'lodash/fp/uniq';

class PhoneNumbersService {
    api;
    blockUI;

    constructor(
        $log, $q, $rootScope,
        api, people
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;
        this.people = people;
        this.loading = false;
        this.page = 1;

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }

    loadCount() {
        if (this.meta) { return this.$q.resolve(); }
        return this.api.get({
            url: 'contacts/people',
            data: {
                filter: {
                    phone_number_valid: false,
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
            url: 'contacts/people',
            data: {
                filter: {
                    phone_number_valid: false,
                    account_list_id: this.api.account_list_id
                },
                fields: {
                    person: 'first_name,last_name,avatar,phone_numbers'
                },
                include: 'phone_numbers',
                page: this.page,
                per_page: 25
            }
        }).then((data) => {
            this.$log.debug('FixPhoneNumbers.load', data);
            this.loading = false;

            this.sources = ['MPDX'];
            this.data = data;
            each((person) => {
                each((phoneNumber) => {
                    this.sources.push(phoneNumber.source);
                }, person.phone_numbers);
            }, data);
            this.sources = uniq(this.sources).sort();

            this.meta = data.meta;
        });
    }

    save(person) {
        person.phone_numbers = each((phoneNumber) => {
            phoneNumber.valid_values = true;
        }, person.phone_numbers);

        return this.people.save(null, person).then(() => {
            this.data = reject({ id: person.id }, this.data);
            if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
                this.meta.pagination.total_count -= 1;
            }
            if (this.data.length <= 5) {
                this.load(true, this.page);
            }
        });
    }

    bulkSave(source) {
        let people = reduce((result, person) => {
            let primaryPhoneNumber = find(['source', source], person.phone_numbers);
            if (primaryPhoneNumber) {
                person.phone_numbers = map(phoneNumber => {
                    phoneNumber.primary = phoneNumber.id === primaryPhoneNumber.id;
                    phoneNumber.valid_values = true;
                    return phoneNumber;
                }, person.phone_numbers);
                result.push(person);
            }
            return result;
        }, [], this.data);

        return this.people.bulkSave(people).then(() => {
            return this.load(true);
        });
    }

    setPrimary(person, primaryPhoneNumber) {
        person.phone_numbers = map(phoneNumber => {
            phoneNumber.primary = phoneNumber.id === primaryPhoneNumber.id;
            return phoneNumber;
        }, person.phone_numbers);
    }

    removePhoneNumber(person, phoneNumber) {
        return this.people.deletePhoneNumber(person, phoneNumber).then(() => {
            person.phone_numbers = reject({id: phoneNumber.id}, person.phone_numbers);
        });
    }

    savePhoneNumber(person, phoneNumber) {
        return this.people.savePhoneNumber(person, phoneNumber);
    }
}

export default angular.module('mpdx.tools.fix.phoneNumbers.service', [])
    .service('fixPhoneNumbers', PhoneNumbersService).name;
