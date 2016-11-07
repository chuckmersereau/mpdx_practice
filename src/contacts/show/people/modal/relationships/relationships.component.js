class ContactFamilyRelationshipController {
    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;

        this.deleted = false;
    }
    $onInit() {
        this.familyRelationship.related_person_id = this.familyRelationship.related_person_id.toString();
        angular.element('[ng-model="this.familyRelationship.related_person_id"] option[value="' + this.person.id + '"]').attr('disabled', 'disabled');
    }
    remove() {
        this.familyRelationship._destroy = 1;
        this.deleted = true;
        this.onRemove();
    }
}

const Relationships = {
    controller: ContactFamilyRelationshipController,
    template: require('./relationships.html'),
    bindings: {
        familyRelationship: '=',
        person: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.family.component', [])
    .component('contactFamilyRelationship', Relationships).name;
