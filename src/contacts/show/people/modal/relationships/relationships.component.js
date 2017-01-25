class ContactFamilyRelationshipController {
    familyRelationship;

    constructor() {
        console.error('get list of active people for account, was on currentAccountList endpoint');
        this.deleted = false;
    }
    $onInit() {
        this.familyRelationship.related_person_id = this.familyRelationship.related_person_id.toString();
    }
    remove() {
        this.deleted = true;
        this.onRemove();
    }
}

const Relationships = {
    controller: ContactFamilyRelationshipController,
    template: require('./relationships.html'),
    bindings: {
        contact: '<',
        familyRelationship: '=',
        person: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.family.component', [])
    .component('contactFamilyRelationship', Relationships).name;
