class CacheService {
    $q;
    api;

    constructor($q, api) {
        this.$q = $q;
        this.api = api;

        this.cache = {};
    }
    path(id) {
        return 'contacts/' + (id || '');
    }
    checkCache(path) {
        var promise = this.$q.defer();
        var cachedContact = _.has(this.cache, path);
        if (cachedContact) {
            promise.resolve(this.cache[path]);
        } else {
            this.api.call('get', path, {}).then((data) => {
                promise.resolve(this.updateContact(data.contact, data));
            });
        }
        return promise;
    }
    get(id) {
        return this.checkCache(this.path(id)).promise;
    }
    getFromCache(id) {
        return this.cache[this.path(id)];
    }
    update(id, contact) {
        if (angular.isUndefined(this.cache[this.path(id)])) { this.cache[this.path(id)] = {}; }
        _.extend(this.cache[this.path(id)], contact);
    }
    updateContact(contact, data) {
        if (!contact) return;
        contact.addresses = _.filter(data.addresses, (addr) => {
            return _.includes(contact.address_ids, addr.id);
        });
        contact.people = _.filter(data.people, (i) => {
            return _.includes(contact.person_ids, i.id);
        });
        _.each(contact.people, (person) => {
            person.email_addresses = _.filter(data.email_addresses, (email) => {
                return _.includes(person.email_address_ids, email.id);
            });
            person.phone_numbers = _.filter(data.phone_numbers, (phone) => {
                return _.includes(person.phone_number_ids, phone.id);
            });
            person.facebook_accounts = _.filter(data.facebook_accounts, (facebookAccount) => {
                return _.includes(person.facebook_account_ids, facebookAccount.id);
            });
            person.twitter_accounts = _.filter(data.twitter_accounts, (twitterAccount) => {
                return _.includes(person.twitter_account_ids, twitterAccount.id);
            });
            person.linkedin_accounts = _.filter(data.linkedin_accounts, (linkedinAccount) => {
                return _.includes(person.linkedin_account_ids, linkedinAccount.id);
            });
            person.family_relationships = _.filter(data.family_relationships, (familyRelationship) => {
                return _.includes(person.family_relationship_ids, familyRelationship.id);
            });
            person.websites = _.filter(data.websites, (website) => {
                return _.includes(person.website_ids, website.id);
            });
            var facebookData = this.convertFromWebsite(person.facebook_accounts, 'facebook');
            var linkedinData = this.convertFromWebsite(person.linkedin_accounts, 'linkedin');
            var twitterData = this.convertFromWebsite(person.twitter_accounts, 'twitter');
            var websiteData = this.convertFromWebsite(person.websites, 'website');
            person.networks = [].concat(facebookData, linkedinData, twitterData, websiteData);
            if (person.birthday_year && person.birthday_month && person.birthday_day) {
                person.birthday = new Date(person.birthday_year, person.birthday_month - 1, person.birthday_day);
            }
            if (person.anniversary_year && person.anniversary_month && person.anniversary_day) {
                person.anniversary = new Date(person.anniversary_year, person.anniversary_month - 1, person.anniversary_day);
            }
        });
        contact.email_addresses = _.flatMap(contact.people, 'email_addresses');
        contact.phone_numbers = _.flatMap(contact.people, 'phone_numbers');
        contact.facebook_accounts = _.flatMap(contact.people, 'facebook_accounts');
        contact.twitter_accounts = _.flatMap(contact.people, 'twitter_accounts');
        contact.linkedin_accounts = _.flatMap(contact.people, 'linkedin_accounts');
        contact.family_relationships = _.flatMap(contact.people, 'family_relationships');
        contact.websites = _.flatMap(contact.people, 'websites');
        this.update(contact.id, contact);
        return this.getFromCache(contact.id);
    }
    convertFromWebsite(values, kind) {
        return _.map(values, (value) => {
            var result = {id: value.id, kind: kind, _destroy: 0};
            if (kind === 'twitter') {
                result.url = value.screen_name;
            } else {
                result.url = value.url;
            }
            return result;
        });
    }
}

export default angular.module('mpdx.contacts.cache.service', [])
    .service('cache', CacheService).name;
