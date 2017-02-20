class PersonService {
    api;

    constructor(
        $filter, $log, $rootScope,
        api
    ) {
        this.$filter = $filter;
        this.$log = $log;
        this.api = api;
        this.includes = 'email_addresses,facebook_accounts,family_relationships,linkedin_accounts,master_person,phone_numbers,twitter_accounts,websites';
        this.selected = null;

        $rootScope.$on('contactPersonUpdated', (e, contactId) => {
            this.list(contactId);
        });
    }
    create(contactId, person) {
        return this.api.post(`contacts/${contactId}/people`, person);
    }
    filterResponseById(values, ids) {
        if (values && ids && values.length > 0 && ids.length > 0) {
            return this.$filter('filter')(values, value => ids.indexOf(value.id) > -1);
        }
        return [];
    }
    get(contactId, personId) {
        return this.api.get(`contacts/${contactId}/people/${personId}`, {include: this.includes}).then((data) => {
            this.$log.debug(`contacts/${contactId}/people/${personId}`, data);
            return data;
        });
    }
    list(contactId) {
        this.selected = null;
        return this.api.get(`contacts/${contactId}/people`, {include: this.includes}).then((data) => {
            this.selected = data;
            return data;
        });
    }
    merge(contact, winnerId, loserId) {
        return this.api.post(`contacts/${contact.id}/people/merges`, {winner_id: winnerId, loser_id: loserId}).then((data) => {
            if (_.isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    bulkMerge(winnersAndLosers) {
        return this.api.post({url: `contacts/people/merges/bulk`, data: winnersAndLosers, type: 'people'}).then((data) => {
            if (_.isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    save(contactId, person) {
        return this.api.put(`contacts/${contactId}/people/${person.id}`, person); //reload after use, otherwise add reconcile
    }
}
export default angular.module('mpdx.contacts.show.people.person.service', [])
    .service('contactPerson', PersonService).name;
