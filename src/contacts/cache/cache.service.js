class CacheService {
    $q;
    api;
    cache;

    constructor($q, api) {
        this.$q = $q;
        this.api = api;

        this.cache = {};
    }
    path(id) {
        return 'contacts/' + (id || '');
    }
    checkCache(path) {
        let promise = this.$q.defer();
        if (_.has(this.cache, path)) {
            promise.resolve(this.cache[path]);
        } else {
            this.api.get(path).then((data) => {
                promise.resolve(this.updateContact(data.data, data));
            });
        }
        return promise.promise;
    }
    get(id) {
        return this.checkCache(this.path(id));
    }
    getFromCache(id) {
        return this.cache[this.path(id)];
    }
    update(id, contact) {
        this.cache[this.path(id)] = _.extend(this.cache[this.path(id)] || {}, contact);
    }
    updateContact(contact) { //, data) {
        if (!contact) return;
        // contact.addresses = _.filter(data.addresses, addr => _.includes(contact.address_ids, addr.id));
        // contact.people = _.filter(data.people, i => _.includes(contact.person_ids, i.id));
        // _.each(contact.people, (person) => {
        //     person.email_addresses = _.filter(data.email_addresses, email => _.includes(person.email_address_ids, email.id));
        //     person.phone_numbers = _.filter(data.phone_numbers, phone => _.includes(person.phone_number_ids, phone.id));
        //     person.facebook_accounts = _.filter(data.facebook_accounts, facebookAccount => _.includes(person.facebook_account_ids, facebookAccount.id));
        //     person.twitter_accounts = _.filter(data.twitter_accounts, twitterAccount => _.includes(person.twitter_account_ids, twitterAccount.id));
        //     person.linkedin_accounts = _.filter(data.linkedin_accounts, linkedinAccount => _.includes(person.linkedin_account_ids`  `, linkedinAccount.id));
        //     person.family_relationships = _.filter(data.family_relationships, familyRelationship => _.includes(person.family_relationship_ids, familyRelationship.id));
        //     person.websites = _.filter(data.websites, website => _.includes(person.website_ids, website.id));
        //     const facebookData = this.convertFromWebsite(person.facebook_accounts, 'facebook');
        //     const linkedinData = this.convertFromWebsite(person.linkedin_accounts, 'linkedin');
        //     const twitterData = this.convertFromWebsite(person.twitter_accounts, 'twitter');
        //     const websiteData = this.convertFromWebsite(person.websites, 'website');
        //     person.networks = [].concat(facebookData, linkedinData, twitterData, websiteData);
        //     if (person.birthday_year && person.birthday_month && person.birthday_day) {
        //         person.birthday = new Date(person.birthday_year, person.birthday_month - 1, person.birthday_day);
        //     }
        //     if (person.anniversary_year && person.anniversary_month && person.anniversary_day) {
        //         person.anniversary = new Date(person.anniversary_year, person.anniversary_month - 1, person.anniversary_day);
        //     }
        // });
        // contact.email_addresses = _.flatMap(contact.people, 'email_addresses');
        // contact.phone_numbers = _.flatMap(contact.people, 'phone_numbers');
        // contact.facebook_accounts = _.flatMap(contact.people, 'facebook_accounts');
        // contact.twitter_accounts = _.flatMap(contact.people, 'twitter_accounts');
        // contact.linkedin_accounts = _.flatMap(contact.people, 'linkedin_accounts');
        // contact.family_relationships = _.flatMap(contact.people, 'family_relationships');
        // contact.websites = _.flatMap(contact.people, 'websites');
        this.update(contact.id, contact);
        return this.getFromCache(contact.id);
    }
    convertFromWebsite(values, kind) {
        return _.map(values, (value) => {
            const result = {id: value.id, kind: kind, _destroy: 0};
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
