class ContactPeopleController {
    api;
    contact;
    contactPerson;

    constructor(
        $log, $state, $rootScope,
        api, contactPerson, gettextCatalog
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.api = api;
        this.contactPerson = contactPerson;
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
        this.contactPerson.list(this.contact.id).then((data) => {
            this.$log.debug('selected people: ', data);
        });
    }
    selectPerson(person) {
        console.log('ping');
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
            alert(this.gettextCatalog.getString('First select at least 2 people to merge'));
        } else {
            this.isMerging = false;
            const ids = _.map(this.selectedPeople, 'id').join();
            this.$state.go('contact.merge_people', { contactId: this.contact.id, peopleIds: ids });
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

export default angular.module('mpdx.contacts.show.people.component', [])
    .component('contactPeople', People).name;
