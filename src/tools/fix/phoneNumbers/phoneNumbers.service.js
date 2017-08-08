import each from 'lodash/fp/each';
import filter from 'lodash/fp/filter';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import uniq from 'lodash/fp/uniq';

class PhoneNumbersService {
    constructor(
        api, people
    ) {
        this.api = api;
        this.people = people;
        this.loading = false;
        this.page = 1;
    }

    loadCount() {
        if (this.meta) { return Promise.resolve(this.meta); }
        return this.api.get(
            'contacts/people',
            {
                filter: {
                    phone_number_valid: false,
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
            'contacts/people',
            {
                filter: {
                    phone_number_valid: false,
                    account_list_id: this.api.account_list_id
                },
                fields: {
                    person: 'first_name,last_name,avatar,phone_numbers,parent_contacts'
                },
                include: 'phone_numbers',
                page: this.page,
                per_page: 25
            }
        ).then((data) => {
            this.loading = false;
            this.sources = ['MPDX'];

            each((person) => {
                each((phoneNumber) => {
                    this.sources.push(phoneNumber.source);
                }, person.phone_numbers);
            }, data);

            this.sources = uniq(this.sources).sort();
            this.data = data;
            this.meta = data.meta;

            return this.data;
        });
    }

    save(person) {
        person.phone_numbers = each((phoneNumber) => {
            phoneNumber.valid_values = true;
        }, person.phone_numbers);

        return this.people.save(person).then(() => {
            this.data = reject({ id: person.id }, this.data);
            if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
                this.meta.pagination.total_count -= 1;
            }
            if (this.data.length === 0) {
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

    hasPrimary(person) {
        return filter((phoneNumber) => phoneNumber.primary, person.phone_numbers).length === 1;
    }
}

import api from 'common/api/api.service';
import people from 'contacts/show/people/people.service';

export default angular.module('mpdx.tools.fix.phoneNumbers.service', [
    api, people
]).service('fixPhoneNumbers', PhoneNumbersService).name;
