import uuid from 'uuid/v1';

class PersonModalController {
    contact;
    contactPerson;
    contacts;

    constructor(
        $log, $rootScope, $scope,
        contactPerson, contact, person
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.contactPerson = contactPerson;
        this.contact = contact;
        this.person = person;
        this.$scope = $scope;
        this.personDetails = '';
        this.maps = [];
        this.activeTab = 'contact-info';

        this.activate();
    }
    activate() {
        if (_.has(this.person, 'id')) {
            this.modalTitle = 'Edit Person';
        } else {
            this.modalTitle = 'Add Person';
            this.person = {
                email_addresses: [],
                phone_numbers: [],
                family_relationships: [],
                networks: []
            };
        }
    }
    save() {
        if (_.has(this.person, 'id')) {
            return this.contactPerson.save(this.contact.id, this.person).then(() => {
                this.$log.debug('person saved:', this.person);
                this.$rootScope.$emit('contactPersonUpdated', this.contact.id);

                this.$scope.$hide();
            });
        } else {
            return this.contactPerson.create(this.contact.id, this.person).then(() => {
                this.$log.debug('person created:', this.person);
                this.$rootScope.$emit('contactPersonUpdated', this.contact.id);
                this.$scope.$hide();
            });
        }
    }
    addEmailAddress() {
        this.person.email_addresses.push(this.emailObject());
    }
    removeEmailAddress() {
    }
    addPhone() {
        this.person.phone_numbers.push(this.phoneObject());
    }
    removePhone() {
    }
    addFamilyRelationship() {
        this.person.family_relationships.push(this.familyRelationshipObject());
    }
    removeFamilyRelationship(index) {
        this.person.family_relationships.splice(index, 1);
    }
    addNetwork() {
        this.person.networks.push(this.networkObject());
    }
    removeNetwork() {
    }
    emailObject() {
        return {id: uuid(), email: '', location: '', _destroy: 0};
    }
    phoneObject() {
        return {id: uuid(), number: '', location: '', _destroy: 0};
    }
    networkObject() {
        return {id: uuid(), url: '', kind: '', _destroy: 0};
    }
    familyRelationshipObject() {
        return {id: uuid(), related_person_id: 0, relationship: '', _destroy: 0};
    }
    delete() {
        this.person._destroy = 1;
        return this.save();
    }
}

export default angular.module('mpdx.contacts.show.personModal.controller', [])
    .controller('personModalController', PersonModalController).name;
