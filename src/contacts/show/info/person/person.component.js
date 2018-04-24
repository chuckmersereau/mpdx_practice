import { defaultTo, find, get } from 'lodash/fp';

class PersonController {
    constructor(
        $rootScope,
        contacts
    ) {
        this.$rootScope = $rootScope;
        this.contacts = contacts;
    }
    $onInit() {
        this.watcher1 = this.$rootScope.$on('changePrimaryPerson', () => this.load());

        this.watcher2 = this.$rootScope.$on('personDeleted', (event, personId) => {
            if (this.person.id === personId) {
                this.load();
            }
        });

        this.watcher3 = this.$rootScope.$on('personUpdated', (event, personId) => {
            if (this.person.id === personId) {
                this.load();
            }
        });

        this.watcher4 = this.$rootScope.$on('peopleMerged', (event, personId, loserIds) => {
            if (loserIds.indexOf(this.person.id) !== -1) {
                this.load();
            }
        });

        this.load();
    }
    $onDestroy() {
        this.watcher1();
        this.watcher2();
        this.watcher3();
        this.watcher4();
    }
    load() {
        this.loading = true;
        return this.contacts.getPrimaryPerson(this.contact.id).then((data) => {
            this.person = data || {};
            this.person.primaryEmailAddress
                = find({ primary: true, historic: false }, defaultTo([], get('email_addresses', this.person)));
            this.person.primaryPhoneNumber
                = find({ primary: true, historic: false }, defaultTo([], get('phone_numbers', this.person)));
            this.loading = false;
        }).catch(() => {
            this.loading = false;
        });
    }
}

const Person = {
    controller: PersonController,
    template: require('./person.html'),
    bindings: {
        contact: '<'
    }
};

import contacts from 'contacts/contacts.service';

export default angular.module('mpdx.contacts.show.info.person.component', [
    contacts
]).component('contactInfoPerson', Person).name;
