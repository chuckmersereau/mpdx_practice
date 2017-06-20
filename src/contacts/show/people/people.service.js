import isFunction from 'lodash/fp/isFunction';
import map from 'lodash/fp/map';
import moment from 'moment';

class PersonService {
    api;
    contacts;
    modal;

    constructor(
        $filter, $log, $q, $rootScope, gettextCatalog,
        api, contacts, modal
    ) {
        this.$filter = $filter;
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.gettextCatalog = gettextCatalog;

        this.api = api;
        this.contacts = contacts;
        this.modal = modal;

        this.includes = 'email_addresses,facebook_accounts,family_relationships,family_relationships.related_person,linkedin_accounts,master_person,phone_numbers,twitter_accounts,websites';
        this.data = [];
    }
    create(contactId, person) {
        return this.api.post(`contacts/${contactId}/people`, person);
    }
    get(contactId, personId) {
        return this.api.get(`contacts/${contactId}/people/${personId}`, {include: this.includes}).then((data) => {
            this.$log.debug(`contacts/${contactId}/people/${personId}`, data);
            return data;
        });
    }
    list(contactId) {
        return this.api.get(`contacts/${contactId}/people`, {include: this.includes}).then((data) => {
            return map(person => {
                if (person.anniversary_year) {
                    person.anniversary = moment(`${person.anniversary_year}-${person.anniversary_month}-${person.anniversary_day}`, 'YYYY-MM-DD').toDate();
                }
                return person;
            }, data);
        });
    }
    listAll(reset = false) {
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
        }
        return this.api.get(`contacts//people`, {
            fields: {
                people: 'first_name,last_name'
            },
            per_page: 10000
        }).then((data) => {
            this.data = data;
            return data;
        });
    }
    merge(contact, winnerId, loserId) {
        return this.api.post(`contacts/${contact.id}/people/merges`, {winner_id: winnerId, loser_id: loserId}).then((data) => {
            if (isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    bulkMerge(winnersAndLosers) {
        return this.api.post({url: `contacts/people/merges/bulk`, data: winnersAndLosers, type: 'people'}).then((data) => {
            if (isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    save(contactId, person) {
        if (contactId !== null) {
            return this.api.put(`contacts/${contactId}/people/${person.id}`, person); //reload after use, otherwise add reconcile
        } else {
            return this.api.put({
                url: `contacts/people/${person.id}`,
                data: person,
                type: 'people'
            }); //reload after use, otherwise add reconcile
        }
    }
    bulkSave(people) {
        return this.api.put({
            url: 'contacts/people/bulk',
            data: people,
            type: 'people'
        });
    }
    remove(contactId, personId) {
        return this.api.delete(`contacts/${contactId}/people/${personId}`);
    }
    deleteEmailAddress(person, emailAddress) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete this email address?');
        return this.modal.confirm(message).then(() => {
            // cannot delete phone object directly
            return this.api.put({
                url: `contacts/people/${person.id}`,
                data: {
                    id: person.id,
                    email_addresses: [
                        {
                            id: emailAddress.id,
                            _destroy: 1
                        }
                    ]
                },
                type: 'people'
            });
        });
    }
    saveEmailAddress(person, emailAddress) {
        if (!emailAddress.email) { return this.$q.reject(); };
        return this.api.put({
            url: `contacts/people/${person.id}`,
            data: {
                id: person.id,
                email_addresses: [
                    emailAddress
                ]
            },
            type: 'people'
        });
    }
    deletePhoneNumber(person, phoneNumber) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete this phone number?');
        return this.modal.confirm(message).then(() => {
            // cannot delete phone object directly
            return this.api.put({
                url: `contacts/people/${person.id}`,
                data: {
                    id: person.id,
                    phone_numbers: [
                        {
                            id: phoneNumber.id,
                            _destroy: 1
                        }
                    ]
                },
                type: 'people'
            });
        });
    }
    savePhoneNumber(person, phoneNumber) {
        if (!phoneNumber.number) { return this.$q.reject(); };
        return this.api.put({
            url: `contacts/people/${person.id}`,
            data: {
                id: person.id,
                phone_numbers: [
                    phoneNumber
                ]
            },
            type: 'people'
        });
    }
    openPeopleModal(contact, personId) {
        const modalOpen = (contact, person) => {
            return this.modal.open({
                template: require('./modal/modal.html'),
                controller: 'personModalController',
                locals: {
                    contact: contact,
                    person: person
                }
            });
        };

        if (personId) {
            return this.get(contact.id, personId).then((person) => {
                return modalOpen(contact, person);
            });
        } else {
            return modalOpen(contact, {});
        }
    }
    openMergePeopleModal(selectedPeople) {
        return this.modal.open({
            template: require('./merge/merge.html'),
            controller: 'mergePeopleModalController',
            locals: {
                selectedPeople: selectedPeople
            }
        });
    }
}


import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.contacts.show.people.service', [
    gettextCatalog,
    api, contacts, modal
]).service('people', PersonService).name;
