import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import find from 'lodash/fp/find';
import findIndex from 'lodash/fp/findIndex';
import filter from 'lodash/fp/filter';
import isFunction from 'lodash/fp/isFunction';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import sortBy from 'lodash/fp/sortBy';
import unionBy from 'lodash/fp/unionBy';
import uniq from 'lodash/fp/uniq';

class ContactsService {
    alerts;
    analytics;
    api;
    contactFilter;
    contactsTags;
    modal;

    constructor(
        $log, $q, $rootScope,
        alerts, api, contactFilter, contactsTags, modal
    ) {
        this.$log = $log;
        this.$q = $q;
        this.alerts = alerts;
        this.api = api;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
        this.modal = modal;

        this.analytics = null;
        this.completeList = null;
        this.data = [];
        this.meta = {};
        this.loading = true;

        this.page = 1;

        $rootScope.$on('contactParamChange', () => {
            $log.debug('contacts service: contact parameter change');
            this.getList(true);
            this.load(true);
        });

        $rootScope.$watch(() => this.contactFilter.wildcard_search, (newVal, oldVal) => {
            if (!oldVal) {
                return;
            }
            $log.debug('contacts service: contact search change');
            this.getList(true);
            this.load(true);
        });

        $rootScope.$on('accountListUpdated', () => {
            this.getList(true);
            this.load(true);
        });

        $rootScope.$watch(() => {
            return angular.toJson({
                selected: this.contactsTags.selectedTags.length,
                rejected: this.contactsTags.rejectedTags.length,
                any: this.contactsTags.anyTags
            });
        }, (newVal, oldVal) => {
            if (oldVal && newVal !== oldVal) {
                $log.debug('contacts service: contacts tags changed');
                this.load(true);
            }
        });
    }
    get(id) {
        return this.api.get(`contacts/${id}`, {
            include: 'addresses,appeals,donor_accounts,contacts_referred_by_me,contacts_that_referred_me',
            fields: {
                contacts_referred_by_me: 'id',
                contacts_that_referred_me: 'id'
            }
        });
    }
    getList(reset = false) {
        this.completeList = []; // to avoid double call
        if (!reset && this.completeList) {
            return this.$q.resolve(this.completeList);
        }
        return this.api.get('contacts', {
            filter: {account_list_id: this.api.account_list_id},
            fields: {
                contacts: 'name'
            },
            per_page: 25000,
            sort: 'name'
        }).then((data) => {
            this.$log.debug('contacts all', data);
            this.completeList = data;
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
            filterParams.tags = joinComma(mapByName(this.contactsTags.selectedTags));
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

        if (reset) {
            this.page = 1;
            this.meta = {};
            this.data = null;
        }

        const filters = this.buildFilterParams();

        return this.api.get({
            url: 'contacts',
            data: {
                filters: filters,
                page: this.page,
                per_page: 25,
                include: 'people,addresses,people.facebook_accounts,people.phone_numbers,people.email_addresses',
                fields: {
                    people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    addresses: 'city,primary_mailing_address,postal_code,state,geo,street,updated_in_db_at',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'url'
                },
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('contacts page ' + data.meta.pagination.page, data);
            let count = this.meta.to || 0;
            this.meta = data.meta;
            if (reset) {
                this.page = 1;
                count = 0;
            }
            if (data.length === 0) {
                this.loading = false;
                return;
            }
            const newContacts = reduce((result, contact) => {
                result.push(contact);
                return result;
            }, [], data);
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
    save(contact) {
        if (contact.tag_list) {
            contact.tag_list = joinComma(contact.tag_list); //fix for api mis-match
        }
        return this.api.put(`contacts/${contact.id}`, contact).then((data) => {
            const completeIndex = findIndex({id: data.id}, this.completeList);
            if (completeIndex > -1 && this.completeList[completeIndex].name !== data.name) {
                this.completeList[completeIndex] = {name: data.name, id: data.id};
                this.completeList = sortBy('name', concat(this.completeList, {name: data.name, id: data.id}));
            }

            const index = findIndex({id: data.id}, this.data);
            if (index > -1) {
                this.load(true); //refresh data list since it could conflict with api pagination
            }
            return data;
        });
    }
    create(contact) {
        contact.account_list = { id: this.api.account_list_id };
        return this.api.post('contacts', contact).then((data) => {
            this.completeList = sortBy('name', concat(this.completeList, {name: data.name, id: data.id}));
            this.load(true); //refresh data list since it could conflict with api pagination
        });
    }
    addBulk(contacts) {
        return this.api.post({url: 'contacts/bulk', data: contacts, type: 'contacts'}).then(() => {
            this.getList(true);
            this.load(true); //refresh data list since it could conflict with api pagination
        });
    }
    addReferrals(contactId, contacts) {
        return this.api.put(`contacts/${contactId}`, {
            id: contactId,
            contacts_referred_by_me: contacts
        }).then(() => {
            this.getList(true);
            this.load(true); //refresh data list since it could conflict with api pagination
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
        let filterParams = {};
        _.forIn(params, (filter, key) => {
            if (_.has(this.contactFilter.params, key)) {
                const currentDefault = defaultParams[key];
                if (_.isArray(filter)) {
                    if (currentDefault.sort().join(',') !== filter.sort().join(',')) {
                        filterParams[key] = filter;
                    }
                } else if (filter !== currentDefault) {
                    filterParams[key] = filter;
                }
            }
        });
        return filterParams;
    }
    resetFilters() {
        this.contactFilter.reset();
    }
    getSelectedContacts() {
        return filter({ selected: true }, this.data);
    }
    getSelectedContactIds() {
        return this.getSelectedContacts().map(contact => contact.id);
    }
    getSelectedContactNames() {
        return this.getSelectedContacts().map(contact => contact.name);
    }
    getTagsFromSelectedContacts() {
        let tagsArray = this.getSelectedContacts().reduce((tagsList, contact) => _.union(tagsList, contact.tag_list), []).sort();
        tagsArray = tagsArray.map((tag) => { return tag.text; });
        return uniq(tagsArray);
    }
    clearSelectedContacts() {
        this.setAllContacts('selected', false);
    }
    selectAllContacts() {
        this.setAllContacts('selected', true);
    }
    getContactPosition(id) {
        return findIndex({ id: id }, this.completeList);
    }
    canGoLeft(id) {
        return this.getContactPosition(id) > 0;
    }
    canGoRight(id) {
        return this.getContactPosition(id) < this.completeList.length - 1;
    }
    getLeftId(id) {
        if (this.canGoLeft(id)) {
            return this.completeList[this.getContactPosition(id) - 1].id;
        }
        return this.completeList[this.completeList.length - 1].id;
    }
    getRightId(id) {
        if (this.canGoRight(id)) {
            return this.completeList[this.getContactPosition(id) + 1].id;
        }
        return this.completeList[0].id;
    }
    setAllContacts(key, value) {
        this.data = reduce((result, contact) => {
            contact[key] = value;
            result.push(contact);
            return result;
        }, [], this.data);
    }
    hideContact(contact) {
        contact.status = 'Never Ask';
        return this.save(contact).then(() => {
            this.completeList = reject({ id: contact.id }, this.completeList);
            this.data = reject({ id: contact.id }, this.data);
        });
    }
    bulkHideContacts() {
        const contacts = map(contact => {
            contact.status = 'Never Ask';
            return contact;
        }, this.getSelectedContacts());
        return this.api.put('contacts/bulk', contacts).then(() => {
            this.data = reject(contact => find({id: contact.id}, contacts) != null, this.data);
        });
    }
    // Needs bulk save
    bulkEditFields(model, contacts) {
        let obj = {};
        if (model.likely_to_give) {
            obj.likely_to_give = model.likely_to_give;
        }
        if (model.next_ask) {
            obj.next_ask = model.next_ask;
        }
        if (model.status) {
            obj.status = model.status;
        }
        if (model.send_newsletter) {
            obj.send_newsletter = model.send_newsletter;
        }
        if (model.church_name) {
            obj.church_name = model.church_name;
        }
        if (model.website) {
            obj.website = model.website;
        }
        if (model.pledge_received) {
            if (model.pledge_received === 'Yes') {
                obj.pledge_received = '1';
            } else {
                obj.pledge_received = '0';
            }
        }
        if (model.pledge_currency) {
            obj.pledge_currency = model.pledge_currency;
        }
        if (model.locale) {
            obj.locale = model.locale[1];
        }

        contacts = reduce((result, contact) => {
            result.push(assign({}, contact, obj));
            return result;
        }, [], contacts);
        return this.api.put('contacts/bulk', contacts);
    }
    getAnalytics(reset = false) {
        if (this.analytics && !reset) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get('contacts/analytics',
            { include:
                'anniversaries_this_week,' +
                'anniversaries_this_week.facebook_accounts,' +
                'anniversaries_this_week.twitter_accounts,' +
                'anniversaries_this_week.email_addresses,' +
                'birthdays_this_week,' +
                'birthdays_this_week.facebook_accounts,' +
                'birthdays_this_week.twitter_accounts,' +
                'birthdays_this_week.email_addresses',
                filter: {account_list_id: this.api.account_list_id} }).then((data) => {
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
        return this.api.delete(`contacts/${contactId}/addresses/${addressId}`);
    }
    openNewContactModal() {
        this.modal.open({
            template: require('./new/new.html'),
            controller: 'contactNewModalController'
        });
    }
    openMapContactsModal(selectedContacts) {
        this.modal.open({
            template: require('./filter/mapContacts/mapContacts.html'),
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

import contactFilter from './filter/filter.service';
import joinComma from "../common/fp/joinComma";
import mapByName from "../common/fp/mapByName";

export default angular.module('mpdx.contacts.service', [contactFilter])
    .service('contacts', ContactsService).name;
