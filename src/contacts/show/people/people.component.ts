import { concat, each, filter, has, includes, reject } from 'lodash/fp';
import flattenCompactAndJoin from '../../../common/fp/flattenCompactAndJoin';
import * as bowser from 'bowser';

class ContactPeopleController {
    contact: any;
    isMerging: boolean;
    isSafari: boolean;
    data: any;
    loading: boolean;
    selectedPeople: any;
    watcher1: any;
    watcher2: any;
    watcher3: any;
    watcher4: any;
    constructor(
        private $log: ng.ILogService,
        private $state: StateService,
        private $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        private alerts: AlertsService,
        private api: ApiService,
        private contacts: ContactsService,
        private people: PeopleService,
        private gettextCatalog: ng.gettext.gettextCatalog
    ) {
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

        this.loading = true;
        return this.people.list(this.contact.id).then((data) => {
            this.$log.debug('selected people: ', data);
            this.data = data;
            this.loading = false;
        }).catch(() => {
            this.loading = false;
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
        contact: '<'
    }
};

import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import api, { ApiService } from '../../../common/api/api.service';
import 'angular-gettext';
import people, { PeopleService } from './people.service';
import uiRouter from '@uirouter/angularjs';
import { StateService } from '@uirouter/core';
import { ContactsService } from '../../contacts.service';

export default angular.module('mpdx.contacts.show.people.component', [
    api, 'gettext', uiRouter,
    alerts, people
]).component('contactPeople', People).name;
