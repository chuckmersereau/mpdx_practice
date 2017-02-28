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

        this.isMerging = false;
        this.selectedPeople = [];
    }
    $onInit() {
        this.init();
    }
    $onChanges() {
        this.init();
    }
    init() {
        if (!_.has(this, 'contact.id')) {
            return;
        }
        this.people.list(this.contact.id).then((data) => {
            this.$log.debug('selected people: ', data);
        });
    }
    selectPerson(person) {
        if (_.includes(this.selectedPeople, person)) {
            person.selected_for_merge = false;
            _.reject(this.selectedPeople, person);
        } else {
            person.selected_for_merge = true;
            this.selectedPeople.push(person);
        }
    }
    openMergeModal() {
        if (this.selectedPeople.length < 2) {
            this.alerts.addAlert(this.gettextCatalog.getString('First select at least 2 people to merge'), 'danger');
        } else {
            this.isMerging = false;
            this.people.openMergePeopleModal(this.contact, this.selectedPeople);
        }
    }
    newPerson() {
        this.people.openPeopleModal(this.contact);
    }
}

const People = {
    controller: ContactPeopleController,
    template: require('./people.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.contacts.show.people.component', [])
    .component('contactPeople', People).name;
