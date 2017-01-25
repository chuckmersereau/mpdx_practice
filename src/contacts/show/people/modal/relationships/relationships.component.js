class ContactFamilyRelationshipController {
    familyRelationship;

    constructor() {
        console.error('get list of active people for account, was on currentAccountList endpoint');
        this.deleted = false;
    }
    $onInit() {
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
