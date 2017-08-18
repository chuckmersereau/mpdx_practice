import concat from 'lodash/fp/concat';
import each from 'lodash/fp/each';
import has from 'lodash/fp/has';
import includes from 'lodash/fp/includes';
import reject from 'lodash/fp/reject';

class ContactPeopleController {
    constructor(
        $log, $state, $rootScope,
        alerts, api, people, gettextCatalog
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.alerts = alerts;
        this.api = api;
        this.people = people;
        this.gettextCatalog = gettextCatalog;

        this.data = [];
        this.isMerging = false;

        $rootScope.$on('accountListUpdated', () => {
            this.init();
        });

        $rootScope.$on('personUpdated', () => {
            this.init();
        });
    }
    $onInit() {
        this.people.listAll(); // lazy load people so the people modal feels snappy
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
        return this.people.list(this.contact.id).then(data => {
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
        }, this.selectedPeople);
        this.selectedPeople = [];
    }
    newPerson() {
        this.people.openPeopleModal(this.contact);
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
