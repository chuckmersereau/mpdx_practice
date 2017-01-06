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
    openMergeModal() {
        let data = [];
        _.each(this.contact.people, (person) => {
            if (person.selected_for_merge === true) {
                data.push(person);
                person.selected_for_merge = false;
            }
        });

        if (data.length < 2) {
            alert(this.gettextCatalog.getString('First select at least 2 people to merge'));
        } else {
            this.isMerging = false;
            const ids = _.map(data, 'id').join();
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
