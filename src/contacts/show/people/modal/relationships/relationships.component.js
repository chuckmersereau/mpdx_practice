class ContactFamilyRelationshipController {
    constructor() {
        this.deleted = false;
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
