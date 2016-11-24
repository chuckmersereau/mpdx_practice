class ContactsService {
    api;
    cache;
    filterService;
    tagsService;

    constructor($rootScope, filterService, tagsService, cache, api, $location) {
        this.api = api;
        this.cache = cache;
        this.filterService = filterService;
        this.tagsService = tagsService;

        this.data = [];
        this.meta = {};
        this.loading = true;

        this.page = 1;

        $rootScope.$watch(() => this.filterService.params, (newVal, oldVal) => {
            if (!_.isEmpty(newVal) && !_.isEmpty(oldVal)) {
                this.load(true);
            }
        }, true);

        $rootScope.$watch(() => this.filterService.wildcard_search, () => {
            const query = $location.search().q;
            if (query) {
                $location.search('q', null);
            } else {
                this.load(true);
            }
        });

        $rootScope.$watch(() => this.api.account_list_id, (accountListId) => {
            if (accountListId) {
                this.load(true);
            }
        });

        $rootScope.$watch(() => {
            return angular.toJson({
                selected: this.tagsService.selectedTags.length,
                rejected: this.tagsService.rejectedTags.length,
                any: this.tagsService.anyTags
            });
        }, (newVal, oldVal) => {
            if (newVal !== oldVal) {
                this.load(true);
            }
        });
    }
    load(reset) {
        this.loading = true;
        let newContacts;

        let filterParams = this.findChangedFilters(this.filterService.default_params, this.filterService.params);

        const wildcardSearch = this.filterService.wildcard_search;
        if (wildcardSearch) {
            filterParams.wildcard_search = wildcardSearch;
        }

        if (this.tagsService.selectedTags.length > 0) {
            filterParams.tags = this.tagsService.selectedTags;
        }
        if (this.tagsService.rejectedTags.length > 0) {
            filterParams.exclude_tags = this.tagsService.rejectedTags;
        }
        filterParams.any_tags = this.tagsService.anyTags;

        return this.api.call('post', 'contacts', {filters: filterParams, page: this.page, per_page: 25}, null, null, null, null, {'X-HTTP-Method-Override': 'get'}).then((data) => {
            if (reset) {
                newContacts = [];
                this.page = 1;
            }
            _.each(data.contacts, (contact) => {
                // fix tag_list difference for list vs show
                contact.tag_list = _.map(contact.tag_list, (tag) => {
                    return { text: tag };
                });
                // end fix
                const currentContact = this.cache.updateContact(contact, data);
                if (reset) {
                    newContacts.push(currentContact);
                } else {
                    this.data.push(currentContact);
                }
            });
            if (reset) {
                this.data = newContacts;
            }
            this.meta = data.meta;
            this.loading = false;
        });
    }
    save(contact) {
        let tagList = _.map(contact.tag_list, tag => tag.text);

        let contactObj = {
            name: contact.name,
            pledge_amount: contact.pledge_amount,
            status: contact.status,
            notes: contact.notes,
            full_name: contact.full_name,
            envelope_greeting: contact.envelope_greeting,
            website: contact.website,
            pledge_frequency: contact.pledge_frequency,
            pledge_start_date: contact.pledge_start_date,
            next_ask: contact.next_ask,
            likely_to_give: contact.likely_to_give,
            church_name: contact.church_name,
            send_newsletter: contact.send_newsletter,
            no_appeals: contact.no_appeals,
            user_changed: contact.user_changed,
            direct_deposit: contact.direct_deposit,
            magazine: contact.magazine,
            pledge_received: contact.pledge_received,
            not_duplicated_with: contact.not_duplicated_with,
            tag_list: tagList,
            primary_person_id: contact.primary_person_id,
            timezone: contact.timezone,
            pledge_currency: contact.pledge_currency,
            locale: contact.locale,
            addresses_attributes: [],
            donor_accounts_attributes: [],
            people_attributes: []
        };

        if (contact.people) {
            _.each(contact.people, (person) => {
                let peopleObj = {
                    id: person.id,
                    first_name: person.first_name,
                    last_name: person.last_name,
                    marital_status: person.marital_status,
                    gender: person.gender,
                    occupation: person.occupation,
                    employer: person.employer,
                    optout_enewsletter: person.optout_enewsletter,
                    deceased: person.deceased,
                    _destroy: person._destroy,
                    email_addresses_attributes: [],
                    phone_numbers_attributes: [],
                    facebook_accounts_attributes: [],
                    twitter_accounts_attributes: [],
                    linkedin_accounts_attributes: [],
                    websites_attributes: [],
                    family_relationships_attributes: []
                };

                if (person.birthday) {
                    peopleObj.birthday_month = (person.birthday.getMonth() + 1) + '';
                    peopleObj.birthday_year = person.birthday.getFullYear() + '';
                    peopleObj.birthday_day = person.birthday.getDate() + '';
                }

                if (person.anniversary) {
                    peopleObj.anniversary_month = (person.anniversary.getMonth() + 1) + '';
                    peopleObj.anniversary_year = person.anniversary.getFullYear() + '';
                    peopleObj.anniversary_day = person.anniversary.getDate() + '';
                }

                if (person.email_addresses) {
                    peopleObj.email_addresses_attributes = _.map(person.email_addresses, (email) => {
                        return {
                            id: email.id,
                            email: email.email,
                            location: email.location,
                            _destroy: email._destroy
                        };
                    });
                }

                if (person.phone_numbers) {
                    peopleObj.phone_numbers_attributes = _.map(person.phone_numbers, (phone) => {
                        return {
                            id: phone.id,
                            number: phone.number,
                            location: phone.location,
                            _destroy: phone._destroy
                        };
                    });
                }

                if (person.networks) {
                    _.each(person.networks, (network) => {
                        let result = {id: network.id, _destroy: network._destroy};
                        if (network.kind === "twitter") {
                            result.screen_name = network.url;
                        } else {
                            result.url = network.url;
                        }
                        switch (network.kind) {
                            case 'facebook':
                                peopleObj.facebook_accounts_attributes.push(result);
                                break;
                            case 'linkedin':
                                peopleObj.linkedin_accounts_attributes.push(result);
                                break;
                            case 'twitter':
                                peopleObj.twitter_accounts_attributes.push(result);
                                break;
                            case 'website':
                                peopleObj.websites_attributes.push(result);
                                break;
                        }
                    });
                }

                if (peopleObj.family_relationships_attributes && person.family_relationships.length > 0) {
                    peopleObj.family_relationships_attributes = person.family_relationships;
                }

                contactObj['people_attributes'].push(peopleObj);
            });
        }

        if (contact.addresses) {
            contactObj['addresses_attributes'] = _.map(contact.addresses, (address) => {
                return {
                    location: address.location,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postal_code: address.postal_code,
                    region: address.region,
                    metro_area: address.metro,
                    country: address.country,
                    historic: address.address_invalid,
                    primary_mailing_address: address.primary_address,
                    _destroy: address._destroy,
                    id: address.id
                };
            });
        }

        if (contact.donor_accounts && contact.donor_accounts.length > 0) {
            contactObj['donor_accounts_attributes'] = _.map(contact.donor_accounts, (donorAccount) => {
                return {
                    id: donorAccount.id,
                    account_number: donorAccount.account_number,
                    organization_id: donorAccount.organization_id,
                    _destroy: donorAccount._destroy
                };
            });
        }

        if (contact.contact_referrals_to_me && contact.contact_referrals_to_me.length > 0) {
            contactObj['contact_referrals_to_me_attributes'] = contact.contact_referrals_to_me;
        }

        return this.api.put(`contacts/${contact.id}`, {contact: contactObj}).then((data) => {
            this.cache.updateContact(data.contact, data);
        });
    }
    create(contact) {
        let contactObj = {
            name: contact.name,
            prefill_attributes_on_create: true
        };

        this.loading = true;
        return this.api.post('contacts', {contact: contactObj}).then(() => {
            this.loading = false;
        });
    }
    loadMoreContacts() {
        if (this.loading) return;
        if (this.page >= this.meta.total_pages) return;
        this.page = this.page + 1;
        this.load(false);
    }
    findChangedFilters(defaultParams, params) {
        var filterParams = {};
        _.forIn(params, (filter, key) => {
            if (_.has(this.filterService.params, key)) {
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
        this.filterService.reset();
    }
    getSelectedContacts() {
        return this.data.filter((contact) => {
            return contact.selected;
        });
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
        return _.uniq(tagsArray);
    }
    clearSelectedContacts() {
        this.setAllContacts('selected', false);
    }
    selectAllContacts() {
        this.setAllContacts('selected', true);
    }
    getContactPosition(id) {
        return _.findIndex(this.data, { id: id });
    }
    canGoLeft(id) {
        return this.getContactPosition(id) > 0;
    }
    canGoRight(id) {
        return this.getContactPosition(id) < this.data.length - 1;
    }
    getLeftId(id) {
        if (this.canGoLeft(id)) {
            return this.data[this.getContactPosition(id) - 1].id;
        }
        return this.data[this.data.length - 1].id;
    }
    getRightId(id) {
        if (this.canGoRight(id)) {
            return this.data[this.getContactPosition(id) + 1].id;
        }
        return this.data[0].id;
    }
    setAllContacts(key, value) {
        _.each(this.data, (contact) => {
            contact[key] = value;
        });
    }
    hideContact(contactId) {
        _.each(this.data, (contact, i) => {
            if (contact.id === contactId) {
                this.data.splice(i, 1);
            }
        });
        return this.api.delete(`/contacts/${contactId}`);
    }
    bulkHideContacts() {
        return this.api.delete('/contacts/bulk_destroy', {ids: this.getSelectedContactIds()}).then(() => {
            this.clearSelectedContacts();
            this.load(true);
        });
    }
    bulkEditFields(model, pledgeCurrencies, contactIds) {
        var obj = {};
        if (model.likelyToGive) {
            obj.likely_to_give = model.likelyToGive;
        }
        if (model.nextAsk) {
            obj['next_ask(1i)'] = model.nextAsk.getFullYear() + '';
            obj['next_ask(2i)'] = (model.nextAsk.getMonth() + 1) + '';
            obj['next_ask(3i)'] = model.nextAsk.getDate() + '';
        }
        if (model.status) {
            obj.status = model.status;
        }
        if (model.sendNewsletter) {
            obj.send_newsletter = model.sendNewsletter;
        }
        if (model.churchName) {
            obj.church_name = model.churchName;
        }
        if (model.website) {
            obj.website = model.website;
        }
        if (model.pledgeReceived) {
            if (model.pledgeReceived === 'Yes') {
                obj.pledge_received = '1';
            } else {
                obj.pledge_received = '0';
            }
        }
        if (model.pledgeCurrency) {
            obj.pledge_currency = pledgeCurrencies[model.pledgeCurrency];
        }
        if (model.locale) {
            obj.locale = model.locale[1];
        }
        return this.api.put('contacts/bulk_update', {
            contact: obj,
            bulk_edit_contact_ids: contactIds.join()
        });
    }
}

import filterService from './filter/filter.service';

export default angular.module('mpdx.contacts.service', [filterService])
    .service('contactsService', ContactsService).name;
