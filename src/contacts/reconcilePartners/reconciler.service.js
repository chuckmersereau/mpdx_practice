import map from 'lodash/fp/map';

class ReconcilerService {
    api;
    people;
    contacts;
    duplicateContactsTotal;
    duplicatePeopleTotal;

    constructor(
        $log,
        api, people, contacts
    ) {
        this.$log = $log;
        this.api = api;
        this.contacts = contacts;
        this.people = people;

        this.perPage = 5;

        this.duplicateContacts = [];
        this.duplicatePeople = [];

        this.duplicateContactsTotal = 0;
        this.duplicatePeopleTotal = 0;

        this.shouldFetchContacts = true;
        this.shouldFetchPeople = true;
    }

    fetchAll(force = false) {
        // this.fetchDuplicateContacts(force);
        this.fetchDuplicatePeople(force);
    }

    fetchDuplicateContacts(force = false) {
        if (!force && !this.shouldFetchContacts) {
            return;
        }

        return this.api.get('contacts/duplicates', {
            include: 'contacts,contacts.addresses',
            fields: {
                contacts: 'addresses,name,square_avatar',
                addresses: 'primary,street,city,state,postal_code'
            },
            filter: {account_list_id: this.api.account_list_id},
            per_page: this.perPage
        }).then((data) => {
            this.duplicateContacts = data;
            this.$log.debug('contacts/duplicates', data);

            this.duplicateContactsTotal = data.meta.pagination.total_count;
            this.shouldFetchContacts = false;

            this.duplicateContacts = map(duplicateContact => {
                duplicateContact.mergeChoice = -1;
                return duplicateContact;
            }, this.duplicateContacts);
        });
    }

    fetchDuplicatePeople(force = false) {
        if (!force && !this.shouldFetchPeople) {
            return;
        }

        return this.api.get('contacts/people/duplicates', {
            include: 'people,shared_contact,people.phone_numbers,people.email_addresses',
            fields: {
                people: 'email_addresses,phone_numbers,first_name,last_name',
                phone_numbers: 'primary,number',
                email_addresses: 'primary,email',
                shared_contact: 'id'
            },
            filter: {account_list_id: this.api.account_list_id},
            per_page: this.perPage
        }).then((data) => {
            this.$log.debug('contacts/people/duplicates', data);
            this.duplicatePeople = map((duplicatePerson) => {
                duplicatePerson.mergeChoice = -1;
                return duplicatePerson;
            }, data);

            this.duplicatePeopleTotal = data.meta.pagination.total_count;
            this.shouldFetchPeople = false;
        });
    }

    confirmDuplicateContact(duplicateContact) {
        let mergeChoice = duplicateContact.mergeChoice;
        let contacts = duplicateContact.contacts;

        if (mergeChoice === 0) {
            this.mergeContacts(contacts[0], contacts[1]);
        } else if (mergeChoice === 1) {
            this.mergeContacts(contacts[1], contacts[0]);
        } else if (mergeChoice === 2) {
            this.ignoreDuplicateContacts(duplicateContact);
        }
    }

    confirmDuplicatePerson(duplicatePerson) {
        let mergeChoice = duplicatePerson.mergeChoice;
        let people = duplicatePerson.people;
        let sharedContact = duplicatePerson.shared_contact;

        if (mergeChoice === 0) {
            this.mergePeople(sharedContact, people[0], people[1]);
        } else if (mergeChoice === 1) {
            this.mergePeople(sharedContact, people[1], people[0]);
        } else if (mergeChoice === 2) {
            this.ignoreDuplicatePeople(duplicatePerson);
        }
    }

    mergeContacts(winnersAndLosers) {
        return this.contacts.merge(winnersAndLosers);
    }

    mergePeople(winnersAndLosers) {
        return this.people.bulkMerge(winnersAndLosers);
    }

    ignoreDuplicateContacts(duplicateContact) {
        return this.api.delete({url: `contacts/duplicates/${duplicateContact.id}`, type: 'contacts'});
    }

    ignoreDuplicatePeople(duplicatePerson) {
        return this.api.delete({url: `contacts/people/duplicates/${duplicatePerson.id}`, type: 'people'});
    }
}
export default angular.module('mpdx.services.reconciler', [])
    .service('contactReconciler', ReconcilerService).name;
