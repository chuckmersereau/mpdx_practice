class ReconcilerService {
    api;
    contactPerson;
    contacts;
    duplicateContactsTotal;
    duplicatePeopleTotal;

    constructor(
        $log,
        api, contactPerson, contacts
    ) {
        this.$log = $log;
        this.api = api;
        this.contacts = contacts;
        this.contactPerson = contactPerson;

        this.perPage = 5;

        this.duplicateContacts = [];
        this.duplicatePeople = [];

        this.duplicateContactsTotal = 0;
        this.duplicatePeopleTotal = 0;

        this.shouldFetchContacts = true;
        this.shouldFetchPeople = true;
    }

    fetchAll(force = false) {
        this.fetchDuplicateContacts(force);
        this.fetchDuplicatePeople(force);
    }

    fetchDuplicateContacts(force = false) {
        if (!force && !this.shouldFetchContacts) {
            return;
        }

        return this.api.get('contacts/duplicates', {
            include: 'contacts,contacts.addresses',
            'fields[addresses]': 'primary,street,city,state,postal_code',
            filter: {account_list_id: this.api.account_list_id},
            per_page: this.perPage
        }).then((data) => {
            this.duplicateContacts = data;
            this.$log.debug('contacts/duplicates', data);

            this.duplicateContactsTotal = data.meta.pagination.total_count;
            this.shouldFetchContacts = false;

            _.each(this.duplicateContacts, (duplicateContact) => {
                duplicateContact.mergeChoice = -1;

                let origName = '';
                let origAddresses = [];

                _.each(duplicateContact.contacts, (contact, index) => {
                    if (index === 0) {
                        origName = contact.name;
                        origAddresses = _.map(_.filter(contact.addresses, address => address.primary), address => `${address.street} ${address.city} ${address.state} ${address.postal_code}`);
                    } else {
                        contact.duplicate_name = contact.name === origName;

                        _.each(contact.addresses, (address) => {
                            address.duplicate = address.primary && _.includes(origAddresses, `${address.street} ${address.city} ${address.state} ${address.postal_code}`);
                        });
                    }
                });
            });
        });
    }

    fetchDuplicatePeople(force = false) {
        if (!force && !this.shouldFetchPeople) {
            return;
        }

        return this.api.get('contacts/people/duplicates', {
            include: 'people,shared_contact,people.phone_numbers,people.email_addresses',
            'fields[people]': 'email_addresses,phone_numbers,first_name,last_name',
            'fields[phone_numbers]': 'primary,number',
            'fields[email_addresses]': 'primary,email',
            filter: {account_list_id: this.api.account_list_id},
            per_page: this.perPage
        }).then((data) => {
            this.duplicatePeople = data;
            this.$log.debug('contacts/people/duplicates', data);

            this.duplicatePeopleTotal = data.meta.pagination.total_count;
            this.shouldFetchPeople = false;

            _.each(this.duplicatePeople, (duplicatePerson) => {
                duplicatePerson.mergeChoice = -1;

                let origName = '';
                let origPhoneNumbers = [];
                let origEmailAddresses = [];
                _.each(duplicatePerson.people, (person, index) => {
                    if (index === 0) {
                        origName = `${person.first_name} ${person.last_name}`;
                        origPhoneNumbers = _.map(_.filter(person.phone_numbers, phoneNumber => phoneNumber.primary), phoneNumber => phoneNumber.number);
                        origEmailAddresses = _.map(_.filter(person.email_addresses, emailAddress => emailAddress.primary), emailAddress => emailAddress.email);
                    } else {
                        person.duplicate_name = `${person.first_name} ${person.last_name}` === origName;

                        _.each(person.phone_numbers, (phoneNumber) => {
                            phoneNumber.duplicate = phoneNumber.primary && _.includes(origPhoneNumbers, phoneNumber.number);
                        });

                        _.each(person.email_addresses, (emailAddress) => {
                            emailAddress.duplicate = emailAddress.primary && _.includes(origEmailAddresses, emailAddress.email);
                        });
                    }
                });
            });
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
            this.ignoreDuplicatePeople(sharedContact, people[0], people[1]);
        }
    }

    mergeContacts(winner, loser) {
        let contacts = [{winner_id: winner.id, loser_id: loser.id}];
        this.contacts.merge(contacts);
    }

    mergePeople(contact, winner, loser) {
        const people = [{winner_id: winner.id, loser_id: loser.id}];
        this.contactPerson.merge(contact, people);
    }

    ignoreDuplicateContacts(duplicateContact) {
        this.api.delete(`contacts/duplicates/${duplicateContact.id}`);
    }

    ignoreDuplicatePeople(contact, person1, person2) {
        let id = `${person1.id}~${person2.id}`;
        this.api.delete(`contacts/${contact.id}/people/duplicates/${id}/`);
    }
}
export default angular.module('mpdx.services.reconciler', [])
    .service('contactReconciler', ReconcilerService).name;
