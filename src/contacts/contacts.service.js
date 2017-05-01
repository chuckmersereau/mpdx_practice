import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import findIndex from 'lodash/fp/findIndex';
import has from 'lodash/fp/has';
import includes from 'lodash/fp/includes';
import isArray from 'lodash/fp/isArray';
import isEqual from 'lodash/fp/isEqual';
import isFunction from 'lodash/fp/isFunction';
import map from 'lodash/fp/map';
import pull from 'lodash/fp/pull';
import pullAllBy from 'lodash/fp/pullAllBy';
import reject from 'lodash/fp/reject';
import toInteger from 'lodash/fp/toInteger';
import union from 'lodash/fp/union';
import unionBy from 'lodash/fp/unionBy';
import joinComma from "../common/fp/joinComma";
import mapByName from "../common/fp/mapByName";
import relationshipId from "../common/fp/relationshipId";
import reduce from 'lodash/fp/reduce';
import reduceObject from '../common/fp/reduceObject';

class ContactsService {
    alerts;
    analytics;
    api;
    contactFilter;
    contactsTags;
    modal;

    constructor(
        $log, $q, $rootScope, gettextCatalog,
        alerts, api, contactFilter, contactsTags, modal
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.alerts = alerts;
        this.api = api;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;

        this.analytics = null;
        this.completeFilteredList = null;
        this.current = null;
        this.data = [];
        this.meta = {};
        this.loading = true;
        this.selectedContacts = [];

        this.page = 1;
        this.completeListLoadCount = 0;
        this.totalContactCount = 0;

        $rootScope.$on('contactsFilterChange', () => {
            this.reset();
        });

        $rootScope.$on('contactsTagsChange', () => {
            this.reset();
        });

        $rootScope.$on('accountListUpdated', () => {
            this.reset(true);
        });
    }
    reset() {
        this.selectedContacts = [];
    }
    get(id) {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                include: 'addresses,donor_accounts,primary_person,contact_referrals_to_me'
            },
            deSerializationOptions: relationshipId(['contacts', 'people']) //for contacts_referred_by_me, contacts_that_referred_me and primary_person
        }).then((data) => {
            data.pledge_amount = toInteger(data.pledge_amount); //fix bad api serialization as string
            return data;
        });
    }
    getName(id) {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                fields: {
                    contacts: 'name'
                }
            }
        });
    }
    getNames(ids) {
        return this.api.get({
            url: 'contacts',
            data: {
                fields: {
                    contacts: 'name'
                },
                filter: {
                    ids: joinComma(ids)
                }
            }
        });
    }
    getFilteredList(reset = false) {
        if (!reset && this.completeFilteredList && this.completeFilteredList.length > 0) {
            return this.$q.resolve(this.completeFilteredList);
        }
        this.completeListLoadCount++;
        const currentCount = angular.copy(this.completeListLoadCount);
        this.completeFilteredList = []; // to avoid double call
        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.buildFilterParams(),
                fields: {
                    contacts: 'name'
                },
                per_page: 25000,
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('contacts all - filtered', data);
            if (currentCount === this.completeListLoadCount) {
                this.completeFilteredList = data;
            }
        });
    }
    search(keyword) {
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
    buildFilterParams() {
        let filterParams = this.findChangedFilters(this.contactFilter.default_params, this.contactFilter.params);

        // set account_list_id
        filterParams.account_list_id = this.api.account_list_id;

        const wildcardSearch = this.contactFilter.wildcard_search;
        if (wildcardSearch) {
            filterParams.wildcard_search = wildcardSearch;
        }

        if (this.contactsTags.selectedTags.length > 0) {
            filterParams.tags = mapByName(this.contactsTags.selectedTags);
        } else {
            delete filterParams.tags;
        }
        if (this.contactsTags.rejectedTags.length > 0) {
            filterParams.exclude_tags = joinComma(mapByName(this.contactsTags.rejectedTags));
        } else {
            delete filterParams.exclude_tags;
        }
        filterParams.any_tags = this.contactsTags.anyTags;

        return filterParams;
    }
    load(reset = false, page = 1) {
        this.loading = true;

        if (!reset && page <= this.page) {
            this.$q.resolve(this.data);
        }

        let currentCount;
        if (reset) {
            this.page = 1;
            this.meta = {};
            this.data = null;
            this.completeListLoadCount++;
            currentCount = angular.copy(this.completeListLoadCount);
        }

        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.buildFilterParams(),
                page: this.page,
                per_page: 25,
                include: 'addresses,people,people.facebook_accounts,people.phone_numbers,people.email_addresses',
                fields: {
                    contact: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people',
                    people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    addresses: 'city,geo,historic,primary_mailing_address,postal_code,state,source,street',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username'
                },
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('contacts page ' + data.meta.pagination.page, data);
            if (reset && currentCount !== this.completeListLoadCount) {
                return;
            }
            let count = this.meta.to || 0;
            this.meta = data.meta;
            if (reset) {
                this.page = 1;
                count = 0;
            }
            if (data.length === 0) {
                this.getTotalCount();
                this.loading = false;
                return;
            }
            const newContacts = angular.copy(data);
            if (reset) {
                this.data = newContacts;
            } else {
                this.data = unionBy('id', this.data, newContacts);
            }
            count += data.length;
            this.meta.to = count;
            this.loading = false;
        });
    }
    getTotalCount() { //only used when search is empty
        this.api.get('contacts', {
            filter: {
                account_list_id: this.api.account_list_id
            },
            per_page: 0
        }).then((data) => {
            this.totalContactCount = data.meta.pagination.total_count;
        });
    }
    updateContactOrList(contact) {
        if (!contact.name) {
            return;
        }
        this.$rootScope.$emit('contactCreated');
    }
    save(contact) {
        if (contact.tag_list) {
            contact.tag_list = joinComma(contact.tag_list); //fix for api mis-match
        }
        return this.api.put(`contacts/${contact.id}`, contact).then((data) => {
            this.updateContactOrList(data);
            this.contactFilter.load(true); // since we don't know how this change could affect the filters
            return data;
        });
    }
    create(contact) {
        contact.account_list = { id: this.api.account_list_id };
        return this.api.post('contacts', contact).then((data) => {
            this.$rootScope.$emit('contactCreated');
            return data;
        });
    }
    addBulk(contacts) {
        return this.api.post({url: 'contacts/bulk', data: contacts, type: 'contacts'}).then(() => {
            this.$rootScope.$emit('contactCreated');
        });
    }
    addReferrals(contact, contacts) {
        return this.api.put(`contacts/${contact.id}`, {
            id: contact.id,
            contacts_referred_by_me: contacts
        }).then(() => {
            this.$rootScope.$emit('contactCreated');
        });
    }
    loadMoreContacts() {
        if (this.loading || this.page >= this.meta.pagination.total_pages) {
            return;
        }
        this.page++;
        this.load(false, this.page);
    }
    findChangedFilters(defaultParams, params) {
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
    resetFilters() {
        this.contactFilter.reset();
    }
    getSelectedContacts() {
        return reduce((result, contact) => {
            if (includes(contact.id, this.selectedContacts)) {
                result = concat(result, contact);
            }
            return result;
        }, [], this.data);
    }
    isSelected(contactId) {
        return includes(contactId, this.selectedContacts);
    }
    selectContact(contactId) {
        if (includes(contactId, this.selectedContacts)) {
            this.selectedContacts = pull(contactId, this.selectedContacts);
        } else {
            this.selectedContacts = union(this.selectedContacts, [contactId]);
        }
    }
    getTagsFromSelectedContacts() {
        // if more selected than data, use contactTags
        if (this.selectedContacts > this.data.length) {
            return map('name', this.contactsTags.data);
        }
        return reduce((result, contact) =>
            union(result, contact.tag_list)
        , [], this.getSelectedContacts()).sort();
    }
    clearSelectedContacts() {
        this.selectedContacts = [];
    }
    selectAllContacts(all = true) {
        if (all) {
            this.getFilteredList().then(() => { //ensure complete filtered list is loaded
                this.selectedContacts = map('id', this.completeFilteredList);
            });
        } else {
            this.selectedContacts = map('id', this.data);
        }
    }
    getContactPosition(id) {
        return findIndex({ id: id }, this.completeFilteredList);
    }
    canGoLeft(id) {
        return this.getContactPosition(id) > 0;
    }
    canGoRight(id) {
        return this.getContactPosition(id) < this.completeFilteredList.length - 1;
    }
    getLeftId(id) {
        if (this.canGoLeft(id)) {
            return this.completeFilteredList[this.getContactPosition(id) - 1].id;
        }
        return this.completeFilteredList[this.completeFilteredList.length - 1].id;
    }
    getRightId(id) {
        if (this.canGoRight(id)) {
            return this.completeFilteredList[this.getContactPosition(id) + 1].id;
        }
        return this.completeFilteredList[0].id;
    }
    hideContact(contact) {
        const message = this.gettextCatalog.getString('Are you sure you wish to hide the selected contact? Hiding a contact in MPDX actually sets the contact status to "Never Ask".');
        return this.modal.confirm(message).then(() => {
            return this.save({
                id: contact.id,
                status: 'Never Ask'
            }).then(() => {
                this.completeFilteredList = reject({id: contact.id}, this.completeFilteredList);
                this.data = reject({id: contact.id}, this.data);
            });
        });
    }
    bulkHideContacts() {
        const message = this.gettextCatalog.getString('Are you sure you wish to hide the selected contacts? Hiding a contact in MPDX actually sets the contact status to "Never Ask".');
        return this.modal.confirm(message).then(() => {
            const contacts = map(contact => {
                return {
                    id: contact.id,
                    status: 'Never Ask'
                };
            }, this.getSelectedContacts());
            return this.bulkSave(contacts).then(() => {
                this.data = pullAllBy('id', contacts, this.data);
                this.completeFilteredList = pullAllBy('id', contacts, this.completeFilteredList);
            });
        });
    }
    bulkSave(contacts) {
        return this.api.put('contacts/bulk', contacts);
    }
    bulkEditFields(model, contacts) {
        contacts = reduce((result, contact) =>
            concat(result, assign({id: contact.id}, model))
        , [], contacts);
        return this.bulkSave(contacts);
    }
    getAnalytics(reset = false) {
        if (this.analytics && !reset) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get({
            url: 'contacts/analytics',
            data: {
                include:
                'anniversaries_this_week,' +
                'anniversaries_this_week.people,' +
                'anniversaries_this_week.people.facebook_accounts,' +
                'anniversaries_this_week.people.twitter_accounts,' +
                'anniversaries_this_week.people.email_addresses,' +
                'birthdays_this_week,' +
                'birthdays_this_week.facebook_accounts,' +
                'birthdays_this_week.twitter_accounts,' +
                'birthdays_this_week.email_addresses',
                fields: {
                    people: 'anniversary_day,anniversary_month,birthday_day,birthday_month,facebook_accounts,first_name,last_name,twitter_accounts,email_addresses,parent_contact',
                    email_addresses: 'email,primary',
                    facebook_accounts: 'username',
                    twitter_accounts: 'screen_name'
                },
                filter: {account_list_id: this.api.account_list_id}
            },
            deSerializationOptions: relationshipId('parent_contact'), //for parent_contact
            beforeDeserializationTransform: (data) => {
                //this avoids infinite recursion between people & contacts
                return reduceObject((result, value, key) => {
                    if (key === 'included') {
                        result[key] = reduce((dataResult, dataValue) => {
                            if (has('relationships.parent_contact.data.type', dataValue)) {
                                dataValue.relationships.parent_contact.data.type = 'parent_contact';
                            }
                            if (dataValue.type === 'contacts') {
                                //duplicate contact include for parent_contact type
                                dataResult = concat(dataResult, {
                                    id: dataValue.id,
                                    type: 'parent_contact'
                                });
                            }
                            return concat(dataResult, dataValue);
                        }, [], value);
                    } else {
                        result[key] = value;
                    }
                    return result;
                }, {}, data);
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('contacts/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    merge(winnersAndLosers) {
        return this.api.post({url: `contacts/merges/bulk`, data: winnersAndLosers, type: 'contacts'}).then((data) => {
            if (isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    bulkMerge(winnersAndLosers) {
        return this.api.post({url: `contacts/merges/bulk`, data: winnersAndLosers, type: 'contacts'}).then((data) => {
            if (isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    openAddressModal(contact, address) {
        let promise = this.$q.defer();

        this.modal.open({
            template: require('./show/address/modal/modal.html'),
            controller: 'addressModalController',
            locals: {
                contact: contact,
                address: address
            },
            onHide: () => {
                promise.resolve();
            }
        });
        return promise.promise;
    }
    saveAddress(contactId, address) {
        return this.api.put(`contacts/${contactId}/addresses/${address.id}`, address);
    }
    addAddress(contactId, address) {
        return this.api.post(`contacts/${contactId}/addresses`, address);
    }
    deleteAddress(contactId, addressId) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete this address?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete(`contacts/${contactId}/addresses/${addressId}`);
        });
    }
    openAddReferralsModal() {
        this.modal.open({
            template: require('./show/referrals/add/add.html'),
            controller: 'addReferralsModalController',
            locals: {
                contact: this.current
            }
        });
    }
    openNewContactModal() {
        this.modal.open({
            template: require('./new/new.html'),
            controller: 'contactNewModalController'
        });
    }
    openMapContactsModal(selectedContacts) {
        this.modal.open({
            template: require('./list/mapContacts/mapContacts.html'),
            controller: 'mapContactsController',
            locals: {
                selectedContacts: selectedContacts
            }
        });
    }
    openMultipleAddModal() {
        this.modal.open({
            template: require('./multiple/multiple.html'),
            controller: 'multipleContactController'
        });
    }
}

import api from '../common/api/api.service';
import contactFilter from './sidebar/filter/filter.service';
import contactsTags from './sidebar/filter/tags/tags.service';
import modal from '../common/modal/modal.service';
import getText from 'angular-gettext';

export default angular.module('mpdx.contacts.service', [
    getText,
    api, contactFilter, contactsTags, modal
]).service('contacts', ContactsService).name;
