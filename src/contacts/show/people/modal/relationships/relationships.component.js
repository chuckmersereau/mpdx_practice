class ContactFamilyRelationshipController {
    currentAccountList;
    familyRelationship;

    constructor() {
        this.deleted = false;
    }
    $onInit() {
        this.familyRelationship.related_person_id = this.familyRelationship.related_person_id.toString();
        //console.log(this.contact);
    }
    remove() {
        //this.familyRelationship._destroy = 1;
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
