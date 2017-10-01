import each from 'lodash/fp/each';
import filter from 'lodash/fp/filter';
import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import flatMap from 'lodash/fp/flatMap';
import union from 'lodash/fp/union';

class EmailAddressesService {
    constructor(
        api, people, tools
    ) {
        this.api = api;
        this.people = people;
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

        return this.api.get('contacts/people', {
            filter: {
                email_address_valid: false,
                account_list_id: this.api.account_list_id,
                deceased: false
            },
            fields: {
                person: 'first_name,last_name,avatar,email_addresses,parent_contacts'
            },
            include: 'email_addresses',
            page: this.page,
            per_page: 25
        }).then((data) => {
            this.loading = false;
            this.sources = union(
                flatMap(
                    (person) => map('source', person.email_addresses)
                    , data),
                ['MPDX']).sort();

            this.data = data;
            this.setMeta(data.meta);

            return this.data;
        });
    }

    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['fix-email-addresses'] = this.meta.pagination.total_count;
        }
    }

    save(person) {
        person.email_addresses = each((emailAddress) => {
            emailAddress.valid_values = true;
        }, person.email_addresses);

        return this.people.save(person).then(() => {
            this.data = reject({ id: person.id }, this.data);
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
        let people = reduce((result, person) => {
            let primaryEmailAddress = find(['source', source], person.email_addresses);
            if (primaryEmailAddress) {
                person.email_addresses = map((emailAddress) => {
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
        person.email_addresses = map((emailAddress) => {
            emailAddress.primary = emailAddress.id === primaryEmailAddress.id;
            return emailAddress;
        }, person.email_addresses);
    }

    removeEmailAddress(person, emailAddress) {
        return this.people.deleteEmailAddress(person, emailAddress).then(() => {
            person.email_addresses = reject({ id: emailAddress.id }, person.email_addresses);
        });
    }

    saveEmailAddress(person, emailAddress) {
        return this.people.saveEmailAddress(person, emailAddress);
    }

    hasPrimary(person) {
        return filter((emailAddress) => emailAddress.primary, person.email_addresses).length === 1;
    }
}

import api from 'common/api/api.service';
import people from 'contacts/show/people/people.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.fix.emailAddresses.service', [
    api, people, tools
]).service('fixEmailAddresses', EmailAddressesService).name;
