import each from 'lodash/fp/each';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import uniq from 'lodash/fp/uniq';

class EmailAddressesService {
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
                    email_address_valid: false,
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
                    email_address_valid: false,
                    account_list_id: this.api.account_list_id
                },
                fields: {
                    person: 'first_name,last_name,avatar,email_addresses'
                },
                include: 'email_addresses',
                page: this.page,
                per_page: 25
            }
        }).then((data) => {
            this.$log.debug('FixEmailAddresses.load', data);
            this.loading = false;

            this.sources = ['MPDX'];
            this.data = data;
            each((person) => {
                each((emailAddress) => {
                    this.sources.push(emailAddress.source);
                }, person.email_addresses);
            }, data);
            this.sources = uniq(this.sources).sort();

            this.meta = data.meta;
        });
    }

    save(person) {
        person.email_addresses = each((emailAddress) => {
            emailAddress.valid_values = true;
        }, person.email_addresses);

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
            let primaryEmailAddress = find(['source', source], person.email_addresses);
            if (primaryEmailAddress) {
                person.email_addresses = map(emailAddress => {
                    emailAddress.primary = emailAddress.id === primaryEmailAddress.id;
                    emailAddress.valid_values = true;
                    return emailAddress;
                }, person.email_addresses);
                result.push(person);
            }
            return result;
        }, [], this.data);

        return this.people.bulkSave(people).then(() => {
            return this.load(true);
        });
    }

    setPrimary(person, primaryEmailAddress) {
        person.email_addresses = map(emailAddress => {
            emailAddress.primary = emailAddress.id === primaryEmailAddress.id;
            return emailAddress;
        }, person.email_addresses);
    }

    removeEmailAddress(person, emailAddress) {
        return this.people.deleteEmailAddress(person, emailAddress).then(() => {
            person.email_addresses = reject({id: emailAddress.id}, person.email_addresses);
        });
    }

    saveEmailAddress(person, emailAddress) {
        return this.people.saveEmailAddress(person, emailAddress);
    }
}

export default angular.module('mpdx.tools.fix.emailAddresses.service', [])
    .service('fixEmailAddresses', EmailAddressesService).name;
