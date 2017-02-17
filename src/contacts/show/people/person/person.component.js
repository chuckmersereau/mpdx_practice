class ContactPersonController {
    contact;
    people;
    constructor(
        $sce,
        people
    ) {
        this.$sce = $sce;
        this.people = people;
    }
    edit() {
        this.people.openPeopleModal(this.contact.id, this.person.id);
    }
    selectCard() {
        if (!this.isMerging) return;
        this.onSelectPerson({person: this.person});
    }
    trustSrc(src) {
        return this.$sce.trustAsResourceUrl(src);
    }
}

const Person = {
    controller: ContactPersonController,
    template: require('./person.html'),
    bindings: {
        contact: '<',
        person: '<',
        isMerging: '<',
        onSelectPerson: '&'
    }
};

export default angular.module('mpdx.contacts.show.person.component', [])
    .component('contactPerson', Person).name;
