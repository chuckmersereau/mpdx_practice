import concat from 'lodash/fp/concat';
import has from 'lodash/fp/has';
import includes from 'lodash/fp/includes';
import reject from 'lodash/fp/reject';

class ContactPeopleController {
    alerts;
    api;
    contact;
    people;

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
            this.people.listAll(true);
        });
    }
    $onInit() {
        this.people.listAll(); //lazy load people so the people modal feels snappy
    }
    $onChanges() {
        this.selectedPeople = [];
        this.init();
    }
    init() {
        if (!has('contact.id', this)) {
            return;
        }
        this.people.list(this.contact.id).then((data) => {
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
            this.isMerging = false;
            this.people.openMergePeopleModal(this.contact, this.selectedPeople).finally(() => {
                this.selectedPeople = [];
            });
        }
    }
    cancelMerge() {
        this.isMerging = false;
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

export default angular.module('mpdx.contacts.show.people.component', [])
    .component('contactPeople', People).name;
