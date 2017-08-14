import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import flow from 'lodash/fp/flow';
import has from 'lodash/fp/has';
import includes from 'lodash/fp/includes';
import isArray from 'lodash/fp/isArray';
import isEqual from 'lodash/fp/isEqual';
import isFunction from 'lodash/fp/isFunction';
import isNil from 'lodash/fp/isNil';
import map from 'lodash/fp/map';
import omitBy from 'lodash/fp/omitBy';
import pull from 'lodash/fp/pull';
import union from 'lodash/fp/union';
import joinComma from "../common/fp/joinComma";
import relationshipId from "../common/fp/relationshipId";
import reduce from 'lodash/fp/reduce';
import reduceObject from '../common/fp/reduceObject';
import emptyToNull from '../common/fp/emptyToNull';
import moment from 'moment';

class ContactsService {
    constructor(
        $log, $q, $rootScope, gettextCatalog,
        alerts, api, contactFilter, contactsTags, modal, serverConstants
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
        this.serverConstants = serverConstants;

        this.analytics = null;
        this.current = null;
        this.selectedContacts = [];
    }
    get(id) {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                include: 'addresses,donor_accounts,primary_person,contact_referrals_to_me',
                fields: {
                    contacts: 'avatar,church_name,envelope_greeting,greeting,last_donation,lifetime_donations,' +
                              'likely_to_give,locale,magazine,name,no_appeals,notes,notes_saved_at,pledge_amount,' +
                              'pledge_currency,pledge_currency_symbol,pledge_frequency,pledge_received,' +
                              'pledge_start_date,send_newsletter,square_avatar,status,status_valid,suggested_changes,' +
                              'tag_list,timezone,website,addresses,contact_referrals_by_me,contact_referrals_to_me,' +
                              'contacts_that_referred_me,donor_accounts,primary_person,no_gift_aid',
                    addresses: 'city,country,created_at,end_date,geo,historic,location,metro_area,postal_code,' +
                               'primary_mailing_address,region,remote_id,seasonal,source,start_date,state,street,' +
                               'updated_at,updated_in_db_at,valid_values',
                    donor_accounts: 'account_number'
                }
            },
            deSerializationOptions: relationshipId(['contacts', 'people']) //for contacts_referred_by_me, contacts_that_referred_me and primary_person
        }).then(data => {
            data.pledge_amount = parseFloat(data.pledge_amount); //fix bad api serialization as string
            if (!isNil(data.pledge_frequency)) {
                data.pledge_frequency = parseFloat(data.pledge_frequency);
            }
            return data;
        });
    }
    getReferrals(id) {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                include: 'contacts_referred_by_me',
                fields: {
                    contacts: 'contacts_referred_by_me,name,created_at'
                }
            }
        }).then((data) => {
            data = data.contacts_referred_by_me;
            this.$log.debug('referrals by contact', id, data);
            return data;
        });
    }
    getNames(ids) {
        return this.api.get('contacts', {
            fields: { contacts: 'name' },
            filter: { ids: joinComma(ids) }
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
        const convertTags = flow(map('name'), joinComma, emptyToNull);
        filterParams = assign(filterParams, {
            account_list_id: this.api.account_list_id,
            wildcard_search: emptyToNull(this.contactFilter.wildcard_search),
            tags: convertTags(this.contactsTags.selectedTags),
            exclude_tags: convertTags(this.contactsTags.rejectedTags),
            any_tags: this.contactsTags.anyTags
        });
        return omitBy(isNil, filterParams);
    }
    save(contact) {
        if (contact.tag_list) {
            contact.tag_list = joinComma(contact.tag_list); //fix for api mis-match
        }
        return this.api.put(`contacts/${contact.id}`, contact).then((data) => {
            if (contact.name) {
                this.$rootScope.$emit('contactCreated');
            }
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
    clearSelectedContacts() {
        this.selectedContacts = [];
    }
    hideContact(contact) {
        const message = this.gettextCatalog.getString('Are you sure you wish to hide the selected contact? Hiding a contact in MPDX actually sets the contact status to "Never Ask".');
        return this.modal.confirm(message).then(() => {
            return this.save({
                id: contact.id,
                status: 'Never Ask'
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
            return Promise.resolve(this.analytics);
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
                    contacts: 'people',
                    people: 'anniversary_day,anniversary_month,anniversary_year,birthday_day,birthday_month,birthday_year,facebook_accounts,first_name,last_name,twitter_accounts,email_addresses,parent_contact',
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
            /* istanbul ignore next */
            this.$log.debug('contacts/analytics', data);
            data.birthdays_this_week = reduce((result, birthday) => {
                if (isNil(birthday)) {
                    return result;
                }
                if (birthday.birthday_year > 1800) {
                    birthday.birthday_date = moment().year(birthday.birthday_year).month(birthday.birthday_month - 1).date(birthday.birthday_day).toDate();
                    return concat(result, birthday);
                }
                return result;
            }, [], data.birthdays_this_week);
            data.anniversaries_this_week = reduce((result, anniversary) => {
                if (isNil(anniversary)) {
                    return result;
                }
                anniversary.people = reduce((iresult, person) => {
                    if (person.anniversary_year > 1800) {
                        person.anniversary_date = moment().year(person.anniversary_year).month(person.anniversary_month - 1).date(person.anniversary_day).toDate();
                        return concat(iresult, person);
                    }
                    return iresult;
                }, [], anniversary.people);
                return anniversary.people.length > 0 ? concat(result, anniversary) : result;
            }, [], data.anniversaries_this_week);
            this.analytics = data;
            return this.analytics;
        });
    }
    merge(winnersAndLosers) {
        return this.api.post({url: `contacts/merges/bulk`, data: winnersAndLosers, type: 'contacts'}).then(data => {
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
        return this.modal.open({
            template: require('./show/referrals/add/add.html'),
            controller: 'addReferralsModalController',
            locals: {
                contact: this.current
            }
        });
    }
    openNewContactModal() {
        return this.modal.open({
            template: require('./new/new.html'),
            controller: 'contactNewModalController'
        });
    }
    openMapContactsModal(selectedContacts) {
        return this.modal.open({
            template: require('./list/mapContacts/mapContacts.html'),
            controller: 'mapContactsController',
            locals: {
                selectedContacts: selectedContacts
            }
        });
    }
    openMultipleAddModal() {
        return this.modal.open({
            template: require('./multiple/multiple.html'),
            controller: 'multipleContactController'
        });
    }
}

import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import contactFilter from './sidebar/filter/filter.service';
import contactsTags from './sidebar/filter/tags/tags.service';
import modal from 'common/modal/modal.service';
import getText from 'angular-gettext';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.contacts.service', [
    getText,
    alerts, api, contactFilter, contactsTags, modal, serverConstants
]).service('contacts', ContactsService).name;
