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
    openModal() {
        this.people.openPeopleModal(this.contact, this.person.id);
    }
    selectCard() {
        if (this.isMerging) {
            this.onSelectPerson({person: this.person});
        } else {
            this.openModal();
        }
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
        onSelectPerson: '&',
        onPrimary: '&',
        view: '<'
    }
};

export default angular.module('mpdx.contacts.show.person.component', [])
    .component('contactPerson', Person).name;
