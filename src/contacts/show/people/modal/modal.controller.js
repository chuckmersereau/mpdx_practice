class PersonModalController {
    contact;
    contacts;

    constructor($scope, contacts, contact, person) {
        this.contacts = contacts;
        this.contact = contact;
        this.person = person;
        this.$scope = $scope;
        this.personDetails = '';
        this.maps = [];

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
        if (angular.isDefined(this.person.id)) {
            var personIndex = _.findIndex(this.contact.people, person => person.id === this.person.id);
            this.contact.people[personIndex] = angular.copy(this.person);
            if (angular.element('#primary_person_id:checked').length === 1) {
                this.contact.primary_person_id = this.person.id;
            }
        } else {
            this.contact.people.push(this.person);
        }
        return this.contacts.save(this.contact).then(() => {
            this.$scope.$hide();
        });
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
    removeFamilyRelationship() {
    }
    addNetwork() {
        this.person.networks.push(this.networkObject());
    }
    removeNetwork() {
    }
    emailObject() {
        return {email: '', location: '', _destroy: 0};
    }
    phoneObject() {
        return {number: '', location: '', _destroy: 0};
    }
    networkObject() {
        return {url: '', kind: '', _destroy: 0};
    }
    familyRelationshipObject() {
        return {related_person_id: 0, relationship: '', _destroy: 0};
    }
    delete() {
        this.person._destroy = 1;
        return this.save();
    }
}

export default angular.module('mpdx.contacts.show.personModal.controller', [])
    .controller('personModalController', PersonModalController).name;
