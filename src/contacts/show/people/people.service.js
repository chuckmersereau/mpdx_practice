class PersonService {
    api;
    contacts;
    modal;

    constructor(
        $filter, $log, $q, $rootScope, $state,
        api, contacts, modal
    ) {
        this.$filter = $filter;
        this.$log = $log;
        this.$q = $q;
        this.$state = $state;
        this.api = api;
        this.contacts = contacts;
        this.modal = modal;

        this.includes = 'email_addresses,facebook_accounts,family_relationships,family_relationships.related_person,linkedin_accounts,master_person,phone_numbers,twitter_accounts,websites';
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
            _.each(data, person => {
                if (person.anniversary_year) {
                    person.anniversary = moment(`${person.anniversary_year}-${person.anniversary_month}-${person.anniversary_day}`, 'YYYY-MM-DD').format('l');
                }
            });
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
    openPeopleModal(contact, personId) {
        let modalOpen = (contact, person) => {
            this.modal.open({
                template: require('./modal/modal.html'),
                controller: 'personModalController',
                locals: {
                    contact: contact,
                    person: person
                },
                onHide: () => {
                    this.list(contact.id);
                }
            });
        };

        if (personId == null) {
            modalOpen(contact, {});
        } else {
            this.get(contact.id, personId).then((person) => {
                modalOpen(contact, person);
            });
        }
    }
    openMergePeopleModal(contact, selectedPeople) {
        this.modal.open({
            template: require('./merge/merge.html'),
            controller: 'mergePeopleModalController',
            locals: {
                selectedPeople: selectedPeople
            },
            onHide: () => {
                this.contacts.selectContact(contact.id);
                this.contacts.load(true);
            }
        });
    }
}
export default angular.module('mpdx.contacts.show.people.service', [])
    .service('people', PersonService).name;
