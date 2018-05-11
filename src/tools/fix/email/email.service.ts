import { each, filter, find, flatMap, map, reduce, reject, union } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';
import people, { PeopleService } from '../../../contacts/show/people/people.service';
import tools, { ToolsService } from '../../tools.service';

export class FixEmailAddressesService {
    data: any;
    loading: boolean;
    meta: any;
    page: number;
    sources: string[];
    constructor(
        private $q: ng.IQService,
        private api: ApiService,
        private people: PeopleService,
        private tools: ToolsService
    ) {
        this.loading = false;
        this.page = 1;
    }
    load(reset: boolean = false, page: number = 1): ng.IPromise<any> {
        if (!reset && this.data && this.page === page) {
            return this.$q.resolve(this.data);
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
        }).then((data: any) => {
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
    private setMeta(meta: any): void {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['fix-email-addresses'] = this.meta.pagination.total_count;
        }
    }
    save(person: any): ng.IPromise<void> {
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
    bulkSave(source: any): ng.IPromise<any> {
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
    setPrimary(person: any, primaryEmailAddress: any): void {
        person.email_addresses = map((emailAddress) => {
            emailAddress.primary = emailAddress.id === primaryEmailAddress.id;
            return emailAddress;
        }, person.email_addresses);
    }
    removeEmailAddress(person: any, emailAddress: any): ng.IPromise<void> {
        return this.people.deleteEmailAddress(person, emailAddress).then(() => {
            person.email_addresses = reject({ id: emailAddress.id }, person.email_addresses);
        });
    }
    saveEmailAddress(person: any, emailAddress: any): ng.IPromise<any> {
        return this.people.saveEmailAddress(person, emailAddress);
    }
    hasPrimary(person: any): boolean {
        return filter((emailAddress) => emailAddress.primary, person.email_addresses).length === 1;
    }
}

export default angular.module('mpdx.tools.fix.emailAddresses.service', [
    api, people, tools
]).service('fixEmailAddresses', FixEmailAddressesService).name;
