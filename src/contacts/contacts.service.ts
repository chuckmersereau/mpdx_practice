import 'angular-gettext';
import {
    assign,
    concat,
    find,
    flow,
    get,
    has,
    includes,
    isArray,
    isEqual,
    isFunction,
    isNil,
    map,
    omitBy,
    pull,
    reduce,
    union
} from 'lodash/fp';
import { convertTags } from '../common/fp/tags';
import api, { ApiService } from '../common/api/api.service';
import contactFilter, { ContactFilterService } from './sidebar/filter/filter.service';
import contactsTags, { ContactsTagsService } from './sidebar/filter/tags/tags.service';
import createPatch from '../common/fp/createPatch';
import emptyToNull from '../common/fp/emptyToNull';
import flattenCompactAndJoin from '../common/fp/flattenCompactAndJoin';
import joinComma from '../common/fp/joinComma';
import modal, { ModalService } from '../common/modal/modal.service';
import reduceObject from '../common/fp/reduceObject';
import relationshipId from '../common/fp/relationshipId';
import serverConstants, { ServerConstantsService } from '../common/serverConstants/serverConstants.service';

export class ContactsService {
    activeDrawer: string;
    activeTab: string;
    current: any;
    initialState: any;
    selectedContacts: string[];
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private contactFilter: ContactFilterService,
        private contactsTags: ContactsTagsService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService
    ) {
        this.current = null;
        this.selectedContacts = [];
        this.activeDrawer = 'details';
        this.activeTab = 'donations';
    }
    get(id: string): ng.IPromise<any> {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                include: 'addresses,donor_accounts,primary_person,contact_referrals_to_me',
                fields: {
                    contacts: 'avatar,church_name,envelope_greeting,greeting,last_donation,lifetime_donations,'
                              + 'likely_to_give,locale,magazine,name,next_ask,no_appeals,notes,notes_saved_at,'
                              + 'pledge_amount,pledge_currency,pledge_currency_symbol,pledge_frequency,pledge_received,'
                              + 'pledge_start_date,send_newsletter,square_avatar,status,status_valid,suggested_changes,'
                              + 'tag_list,timezone,website,addresses,contact_referrals_by_me,contact_referrals_to_me,'
                              + 'contacts_that_referred_me,donor_accounts,primary_person,no_gift_aid,timezone',
                    addresses: 'city,country,created_at,end_date,geo,historic,location,metro_area,postal_code,'
                               + 'primary_mailing_address,region,remote_id,seasonal,source,start_date,state,street,'
                               + 'updated_at,updated_in_db_at,valid_values',
                    donor_accounts: 'account_number'
                }
            },
            deSerializationOptions: relationshipId(['contacts', 'people']) // for contacts_referred_by_me, contacts_that_referred_me and primary_person
        }).then((data: any) => {
            data.pledge_amount = parseFloat(data.pledge_amount); // fix bad api serialization as string
            if (!isNil(data.pledge_frequency)) {
                data.pledge_frequency = parseFloat(data.pledge_frequency);
            }
            return data;
        });
    }
    getRecommendation(id: string): ng.IPromise<any> {
        return this.api.get({
            url: `contacts/${id}/donation_amount_recommendations`,
            data: {
                page: 1,
                per_page: 1
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('recommendation by contact', id, data[0]);
            return data[0];
        });
    }
    getReferrals(id: string): ng.IPromise<any> {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                include: 'contacts_referred_by_me',
                fields: {
                    contacts: 'contacts_referred_by_me,name,created_at'
                }
            }
        }).then((data: any) => {
            data = data.contacts_referred_by_me;
            /* istanbul ignore next */
            this.$log.debug('referrals by contact', id, data);
            return data;
        });
    }
    getPrimaryPerson(id: string): ng.IPromise<any> {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                include: 'primary_person,people.email_addresses,people.phone_numbers',
                fields: {
                    contacts: 'primary_person',
                    people: 'first_name,last_name,phone_numbers,email_addresses',
                    phone_numbers: 'primary,historic,number',
                    email_addresses: 'primary,historic,email'
                }
            }
        }).then((data: any) => {
            data = data.primary_person;
            /* istanbul ignore next */
            this.$log.debug('primary person', id, data);
            return data;
        });
    }
    search(keyword: string): ng.IPromise<any> {
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    wildcard_search: keyword
                },
                fields: {
                    contacts: 'name'
                },
                per_page: 6,
                sort: 'name'
            }
        });
    }
    buildFilterParams(): any {
        let filterParams = this.findChangedFilters(this.contactFilter.default_params, this.contactFilter.params);
        filterParams = assign(filterParams, {
            account_list_id: this.api.account_list_id,
            wildcard_search: emptyToNull(this.contactFilter.wildcardSearch),
            tags: convertTags(this.contactsTags.selectedTags),
            exclude_tags: convertTags(this.contactsTags.rejectedTags),
            any_tags: this.contactsTags.anyTags
        });
        return omitBy(isNil, filterParams);
    }
    save(contact: any, successMessage?: string, errorMessage?: string): ng.IPromise<any> {
        if (contact.tag_list) {
            contact.tag_list = joinComma(contact.tag_list); // fix for api mis-match
        }
        return this.api.put(`contacts/${contact.id}`, contact, successMessage, errorMessage).then((data) => {
            if (contact.name) {
                this.$rootScope.$emit('contactCreated');
            }
            return data;
        });
    }
    saveCurrent() {
        const source = angular.copy(this.current); // to avoid onChanges changes
        const target = angular.copy(this.initialState); // to avoid onChanges changes
        const patch = createPatch(target, source);
        this.$log.debug('contact patch', patch);
        const errorMessage = this.gettextCatalog.getString('Unable to save changes.');
        const successMessage = this.gettextCatalog.getString('Changes saved successfully.');

        return this.save(patch, successMessage, errorMessage).then(() => {
            if (patch.tag_list) {
                const tags = patch.tag_list.split(',');
                this.$rootScope.$emit('contactTagsAdded', { tags: tags });
                this.contactsTags.addTag({ tags: tags });
            }
            if (patch.id === this.initialState.id) {
                this.initialState = assign(this.initialState, patch);
            }
        });
    }
    create(contact: any): ng.IPromise<any> {
        contact.account_list = { id: this.api.account_list_id };
        return this.api.post('contacts', contact).then((data) => {
            this.$rootScope.$emit('contactCreated');
            return data;
        });
    }
    addBulk(contacts: any[]): ng.IPromise<any> {
        return this.api.post({
            url: 'contacts/bulk',
            data: contacts,
            type: 'contacts',
            fields: {
                contacts: ''
            }
        }).then(() => {
            this.$rootScope.$emit('contactCreated');
        });
    }
    addReferrals(contact: any, contacts: any[]): ng.IPromise<any> {
        return this.api.put(`contacts/${contact.id}`, {
            id: contact.id,
            contacts_referred_by_me: contacts
        }).then(() => {
            this.$rootScope.$emit('contactCreated');
        });
    }
    private findChangedFilters(defaultParams: any, params: any): any {
        return reduceObject((result, filter, key) => {
            if (has(key, this.contactFilter.params)) {
                const currentDefault = defaultParams[key];
                if (isArray(filter)) {
                    if (!isEqual(currentDefault, filter)) {
                        result[key] = filter;
                    }
                } else if (filter !== currentDefault) {
                    result[key] = filter;
                }
            }
            return result;
        }, {}, params);
    }
    isSelected(contactId: string): boolean {
        return includes(contactId, this.selectedContacts);
    }
    selectContact(contactId: string): void {
        if (includes(contactId, this.selectedContacts)) {
            this.selectedContacts = pull(contactId, this.selectedContacts);
        } else {
            this.selectedContacts = union(this.selectedContacts, [contactId]);
        }
    }
    clearSelectedContacts(): void {
        this.selectedContacts = [];
    }
    hideContact(contact: any): ng.IPromise<any> {
        const message = this.gettextCatalog.getString('Are you sure you wish to hide the selected contact? Hiding a contact in MPDX actually sets the contact status to "Never Ask".');
        return this.modal.confirm(message).then(() => {
            return this.save({
                id: contact.id,
                status: 'Never Ask'
            }).then(() => {
                contact.status = 'Never Ask';
                this.$rootScope.$emit('contactHidden', contact.id);
                return contact;
            });
        });
    }
    bulkSave(contacts: any[]): ng.IPromise<any> {
        return this.api.put('contacts/bulk', contacts);
    }
    bulkEditFields(model: any, contacts: any[]): ng.IPromise<any> {
        contacts = reduce((result, contact) =>
            concat(result, assign({ id: contact.id }, model))
            , [], contacts);
        return this.bulkSave(contacts);
    }
    merge(winnersAndLosers: any): ng.IPromise<any> {
        return this.api.post({
            url: 'contacts/merges/bulk',
            data: winnersAndLosers,
            type: 'contacts'
        }).then((data: any) => {
            if (isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    openAddressModal(contact: any, address: any): ng.IPromise<any> {
        let promise = this.$q.defer();

        this.modal.open({
            template: require('./show/addresses/address/modal/modal.html'),
            controller: 'addressModalController',
            locals: {
                contact: contact,
                address: address || { source: 'MPDX' }
            },
            resolve: {
                0: () => this.serverConstants.load(['assignable_locations'])
            },
            onHide: () => {
                promise.resolve();
            }
        });
        return promise.promise;
    }
    saveAddress(contactId: string, address: any): ng.IPromise<any> {
        return this.api.put(`contacts/${contactId}/addresses/${address.id}`, address);
    }
    addAddress(contactId: string, address: any): ng.IPromise<any> {
        return this.api.post(`contacts/${contactId}/addresses`, address);
    }
    deleteAddress(contactId: string, addressId: string): ng.IPromise<any> {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete this address?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`contacts/${contactId}/addresses/${addressId}`);
        });
    }
    openAddReferralsModal(): ng.IPromise<any> {
        return this.modal.open({
            template: require('./show/referrals/add/add.html'),
            controller: 'addReferralsModalController',
            locals: {
                contact: this.current
            }
        });
    }
    openNewContactModal(): ng.IPromise<any> {
        return this.modal.open({
            template: require('./new/new.html'),
            controller: 'contactNewModalController'
        });
    }
    openMultipleAddModal(): ng.IPromise<any> {
        return this.modal.open({
            template: require('./multiple/multiple.html'),
            controller: 'multipleContactController'
        });
    }
    openAddTagModal(selectedContactIds: any[]): ng.IPromise<any> {
        return this.modal.open({
            template: require('./sidebar/filter/tags/add/add.html'),
            controller: 'addTagController',
            locals: {
                selectedContacts: selectedContactIds
            }
        });
    }
    fixPledgeAmountAndFrequencies(data: any): any[] {
        return map((contact) => assign(contact, {
            pledge_amount: isNil(contact.pledge_amount) ? null : parseFloat(contact.pledge_amount),
            pledge_frequency: isNil(contact.pledge_frequency)
                ? null
                : this.serverConstants.getPledgeFrequencyValue(contact.pledge_frequency)
        }), angular.copy(data));
    }
    getEmails(errorMessage: string): ng.IPromise<any> {
        return this.api.get('contacts', {
            filter: {
                account_list_id: this.api.account_list_id,
                newsletter: 'email',
                status: 'active'
            },
            include: 'people,people.email_addresses',
            fields: {
                contact: 'people',
                people: 'deceased,email_addresses,optout_enewsletter',
                email_addresses: 'email,primary'
            },
            per_page: 25000
        }, undefined, errorMessage).then((data) => {
            return this.mapEmails(data);
        });
    }
    private mapEmails(data: any): any {
        return flattenCompactAndJoin((contact) => this.getEmailsFromPeople(contact.people), data);
    }
    getEmailsFromPeople(data: any): any {
        const getEmail = get('email');
        const findPrimary = find({ primary: true });
        const getEmailFromPrimary = flow(findPrimary, getEmail);
        return map((person) => {
            return person.deceased || person.optout_enewsletter ? null : getEmailFromPrimary(person.email_addresses);
        }, data);
    }
}

export default angular.module('mpdx.contacts.service', [
    'gettext',
    api, contactFilter, contactsTags, modal, serverConstants
]).service('contacts', ContactsService).name;
