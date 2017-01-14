class ContactsService {
    analytics;
    api;
    cache;
    contactFilter;
    contactsTags;

    constructor(
        $location, $log, $q, $rootScope, $timeout,
        api, cache, contactFilter, contactsTags
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$timeout = $timeout;
        this.api = api;
        this.cache = cache;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;

        this.analytics = null;
        this.data = [];
        this.meta = {};
        this.loading = true;

        this.page = 1;

        $rootScope.$on('contactParamChange', () => {
            $log.debug('contacts service: contact parameter change');
            this.load(true);
        });

        $rootScope.$watch(() => this.contactFilter.wildcard_search, (newVal, oldVal) => {
            if (!oldVal) {
                return;
            }
            $log.debug('contacts service: contact search change');
            const query = $location.search().q;
            if (query) {
                $location.search('q', null);
            } else {
                this.load(true);
            }
        });

        $rootScope.$on('accountListUpdated', () => {
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
        return this.api.get(`contacts/${id}`, {include: 'people,addresses'});
    }
    load(reset) {
        this.loading = true;
        if (reset) {
            this.page = 1;
            this.meta = {};
            this.data = null;
        }
        let newContacts;

        let filterParams = this.findChangedFilters(this.contactFilter.default_params, this.contactFilter.params);

        const wildcardSearch = this.contactFilter.wildcard_search;
        if (wildcardSearch) {
            filterParams.wildcard_search = wildcardSearch;
        }

        if (this.contactsTags.selectedTags.length > 0) {
            filterParams.tags = _.map(this.contactsTags.selectedTags, tag => tag.name).join(',');
        }
        if (this.contactsTags.rejectedTags.length > 0) {
            filterParams.exclude_tags = _.map(this.contactsTags.rejectedTags, tag => tag.name).join(',');
        }
        filterParams.any_tags = this.contactsTags.anyTags;

        return this.api.get({
            url: 'contacts',
            data: {
                filters: filterParams,
                page: this.page,
                per_page: 25,
                include: 'people,addresses',
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then((data) => {
            this.$log.debug('contacts page ' + data.meta.pagination.page, data);
            let count = this.meta.to || 0;
            this.meta = data.meta;
            if (reset) {
                newContacts = [];
                this.page = 1;
                count = 0;
            }
            if (data.length === 0) {
                this.loading = false;
                return;
            }
            _.each(data, (contact) => {
                // fix tag_list difference for list vs show
                contact.tag_list = _.map(contact.tag_list, (tag) => {
                    return { text: tag };
                });
                // end fix
                const currentContact = this.cache.updateContact(contact, data);
                if (reset) {
                    newContacts.push(currentContact);
                } else {
                    this.data = _.unionBy(this.data, [currentContact], 'id');
                }
            });
            if (reset) {
                this.data = newContacts;
            }
            count += data.length;
            this.meta.to = count;
            this.loading = false;

            //uncomment to add lazy contact loading
            // this.$timeout(() => {
            //     this.loadMoreContacts();
            // }, 1000);
        });
    }
    save(contact) {
        return this.api.put(`contacts/${contact.id}`, contact).then((data) => {
            this.cache.updateContact(data.contact, data);
        });
    }
    create(contact) {
        let contactObj = {
            name: contact.name,
            prefill_attributes_on_create: true
        };

        return this.api.post('contacts', {contact: contactObj}).then((data) => {
            this.cache.updateContact(data.contact, data);
            return this.cache.get(data.contact.id);
        });
    }
    loadMoreContacts() {
        if (this.loading || this.page >= this.meta.pagination.total_pages) {
            return;
        }
        this.page++;
        this.load(false);
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
        return _.filter(this.data, { selected: true });
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
        _.remove(this.data, (contact) => contact.id === contactId);
        return this.api.delete(`/contacts/${contactId}`);
    }
    bulkHideContacts() {
        return this.api.delete('/contacts/bulk_destroy', {ids: this.getSelectedContactIds()}).then(() => {
            this.clearSelectedContacts();
            this.load(true);
        });
    }
    bulkEditFields(model, pledgeCurrencies, contactIds) {
        let obj = {};
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
    getDonorAccounts() {
        if (!this.donorAccounts) {
            this.donorAccounts = [];
            _.each(this.data, contact => _.union(this.donorAccounts, contact.donor_accounts));
        }
    }
    getAnalytics() {
        if (this.analytics) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get('contacts/analytics').then((data) => {
            this.$log.debug('contacts/analytics', data);
            this.analytics = data;
            return this.analytics;
        }).catch((err) => {
            this.$log.error('contacts/analytics not implemented.', err);
        });
    }
}

import contactFilter from './filter/filter.service';

export default angular.module('mpdx.contacts.service', [contactFilter])
    .service('contacts', ContactsService).name;
