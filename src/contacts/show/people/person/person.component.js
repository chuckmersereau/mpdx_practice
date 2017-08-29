class ContactPersonController {
    constructor(
        $sce,
        gettextCatalog,
        people
    ) {
        this.$sce = $sce;
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
        return this.people.openPeopleModal(this.contact, this.person.id);
    }

    selectCard() {
        if (this.isMerging) {
            this.onSelectPerson({ person: this.person });
        }
    }

    trustSrc(src) {
        return this.$sce.trustAsResourceUrl(src);
    }

    updateAvatar(avatar) {
        return this.people.updateAvatar(this.person, avatar);
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

import gettextCatalog from 'angular-gettext';
import people from '../people.service';

export default angular.module('mpdx.contacts.show.person.component', [
    gettextCatalog,
    people
]).component('contactPerson', Person).name;
