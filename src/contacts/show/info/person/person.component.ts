import { defaultTo, find, get } from 'lodash/fp';
import contacts, { ContactsService } from '../../../contacts.service';

class PersonController {
    contact: any;
    loading: boolean;
    person: any;
    watcher1: any;
    watcher2: any;
    watcher3: any;
    watcher4: any;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private contacts: ContactsService
    ) {}
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

export default angular.module('mpdx.contacts.show.info.person.component', [
    contacts
]).component('contactInfoPerson', Person).name;
