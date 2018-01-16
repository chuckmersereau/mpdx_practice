import concat from 'lodash/fp/concat';
import each from 'lodash/fp/each';
import filter from 'lodash/fp/filter';
import flattenCompactAndJoin from 'common/fp/flattenCompactAndJoin';
import has from 'lodash/fp/has';
import includes from 'lodash/fp/includes';
import reject from 'lodash/fp/reject';
import bowser from 'bowser';

class ContactPeopleController {
    constructor(
        $log, $state, $rootScope, $window,
        alerts, api, contacts, people, gettextCatalog
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$window = $window;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.people = people;
        this.gettextCatalog = gettextCatalog;

        this.data = [];
        this.isMerging = false;
        this.isSafari = bowser.name === 'Safari';
    }
    $onInit() {
        this.watcher1 = this.$rootScope.$on('accountListUpdated', () => this.init());

        this.watcher2 = this.$rootScope.$on('personCreated', (event, personId) => {
            this.people.get(personId).then((person) => {
                this.data.push(person);
            });
        });

        this.watcher3 = this.$rootScope.$on('personDeleted', (event, personId) => {
            this.data = filter((person) => {
                return person.id !== personId;
            }, this.data);
        });

        this.watcher4 = this.$rootScope.$on('peopleMerged', (event, personId, loserIds) => {
            this.data = filter((person) => {
                return !includes(person.id, loserIds);
            }, this.data);
        });

        this.people.listAll(); // lazy load people so the people modal feels snappy
    }
    $onDestroy() {
        this.watcher1();
        this.watcher2();
        this.watcher3();
        this.watcher4();
    }
    $onChanges() {
        this.selectedPeople = [];
        this.init();
    }
    init() {
        if (!has('contact.id', this)) {
            return;
        }

        this.data = [];

        return this.people.list(this.contact.id).then((data) => {
            this.$log.debug('selected people: ', data);
            this.data = data;
        });
    }
    selectPerson(person) {
        if (includes(person, this.selectedPeople)) {
            person.selected_for_merge = false;
            this.selectedPeople = reject(person, this.selectedPeople);
        } else {
            person.selected_for_merge = true;
            this.selectedPeople = concat(this.selectedPeople, person);
        }
    }
    openMergeModal() {
        if (this.selectedPeople.length < 2) {
            this.alerts.addAlert(this.gettextCatalog.getString('First select at least 2 people to merge'), 'danger');
        } else {
            return this.people.openMergePeopleModal(this.selectedPeople).then(() => {
                this.isMerging = false;
                this.selectedPeople = [];
            });
        }
    }
    cancelMerge() {
        this.isMerging = false;
        each((person) => {
            person.selected_for_merge = false;
        }, this.data);
        this.selectedPeople = [];
    }
    newPerson() {
        this.people.openPeopleModal(this.contact);
    }
    emailAll() {
        const emails = flattenCompactAndJoin((email) => email, this.contacts.getEmailsFromPeople(this.data));
        if (this.isSafari) {
            this.$window.href = `mailto:${emails}`;
        } else {
            this.$window.open(`mailto:${emails}`);
        }
    }
}

const People = {
    controller: ContactPeopleController,
    template: require('./people.html'),
    bindings: {
        contact: '<',
        onPrimary: '&'
    }
};

import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import gettext from 'angular-gettext';
import people from './people.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.contacts.show.people.component', [
    api, gettext, uiRouter,
    alerts, people
]).component('contactPeople', People).name;
