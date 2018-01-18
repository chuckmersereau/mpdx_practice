class ContactPersonController {
    constructor(
        $rootScope, $sce,
        gettextCatalog,
        people
    ) {
        this.$rootScope = $rootScope;
        this.$sce = $sce;
        this.people = people;

        this.translatedLocations = {
            fax: gettextCatalog.getString('Fax'),
            home: gettextCatalog.getString('Home'),
            mobile: gettextCatalog.getString('Mobile'),
            other: gettextCatalog.getString('Other'),
            personal: gettextCatalog.getString('Personal'),
            work: gettextCatalog.getString('Work')
        };
    }
    $onInit() {
        this.watcher1 = this.$rootScope.$on('personUpdated', (event, personId) => {
            if (this.person.id === personId) {
                this.people.get(personId).then((person) => {
                    this.person = person;
                });
            }
        });

        this.watcher2 = this.$rootScope.$on('peopleMerged', (event, personId) => {
            if (this.person.id === personId) {
                this.people.get(personId).then((person) => {
                    this.person = person;
                });
            }
        });
    }
    $onDestroy() {
        this.watcher1();
        this.watcher2();
    }
    openModal() {
        return this.people.openPeopleModal(this.contact, this.person.id, this.userProfile);
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
        userProfile: '@',
        view: '<'
    }
};

import gettextCatalog from 'angular-gettext';
import people from '../people.service';

export default angular.module('mpdx.contacts.show.person.component', [
    gettextCatalog,
    people
]).component('contactPerson', Person).name;
