class ContactPersonController {
    contact;
    people;
    constructor(
        $sce, gettextCatalog,
        locale, people
    ) {
        this.$sce = $sce;
        this.locale = locale;
        this.people = people;

        this.translatedLocations = {
            home: gettextCatalog.getString('Home'),
            mobile: gettextCatalog.getString('Mobile'),
            work: gettextCatalog.getString('Work'),
            fax: gettextCatalog.getString('Fax'),
            other: gettextCatalog.getString('Other')
        };
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
