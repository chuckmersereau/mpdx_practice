import { each, filter, find, map, reduce, reject, uniq } from 'lodash/fp';

export class FixPhoneNumbersService {
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

        return this.api.get(
            'contacts/people',
            {
                filter: {
                    phone_number_valid: false,
                    account_list_id: this.api.account_list_id,
                    deceased: false
                },
                fields: {
                    person: 'first_name,last_name,avatar,phone_numbers,parent_contacts'
                },
                include: 'phone_numbers',
                page: this.page,
                per_page: 25
            }
        ).then((data: any) => {
            this.loading = false;
            this.sources = ['MPDX'];

            each((person) => {
                each((phoneNumber) => {
                    this.sources.push(phoneNumber.source);
                }, person.phone_numbers);
            }, data);

            this.sources = uniq(this.sources).sort();
            this.data = data;
            this.setMeta(data.meta);

            return this.data;
        });
    }
    private setMeta(meta: any): void {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['fix-phone-numbers'] = this.meta.pagination.total_count;
        }
    }
    save(person: any): ng.IPromise<void> {
        person.phone_numbers = each((phoneNumber) => {
            phoneNumber.valid_values = true;
        }, person.phone_numbers);

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
            let primaryPhoneNumber = find(['source', source], person.phone_numbers);
            if (primaryPhoneNumber) {
                person.phone_numbers = map((phoneNumber) => {
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
    setPrimary(person: any, primaryPhoneNumber: any): void {
        person.phone_numbers = map((phoneNumber) => {
            phoneNumber.primary = phoneNumber.id === primaryPhoneNumber.id;
            return phoneNumber;
        }, person.phone_numbers);
    }
    removePhoneNumber(person: any, phoneNumber: any): ng.IPromise<void> {
        return this.people.deletePhoneNumber(person, phoneNumber).then(() => {
            person.phone_numbers = reject({ id: phoneNumber.id }, person.phone_numbers);
        });
    }
    savePhoneNumber(person: any, phoneNumber: any): ng.IPromise<any> {
        return this.people.savePhoneNumber(person, phoneNumber);
    }
    hasPrimary(person: any): boolean {
        return filter((phoneNumber) => phoneNumber.primary, person.phone_numbers).length === 1;
    }
}

import api, { ApiService } from '../../../common/api/api.service';
import people, { PeopleService } from '../../../contacts/show/people/people.service';
import tools, { ToolsService } from '../../../tools/tools.service';

export default angular.module('mpdx.tools.fix.phoneNumbers.service', [
    api, people, tools
]).service('fixPhoneNumbers', FixPhoneNumbersService).name;
