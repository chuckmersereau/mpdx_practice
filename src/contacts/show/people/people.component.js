class ContactPeopleController {
    api;
    contact;

    constructor(
        $log, $state,
        api, gettextCatalog
    ) {
        this.$log = $log;
        this.$state = $state;
        this.api = api;
        this.gettextCatalog = gettextCatalog;

        this.isMerging = false;
        this.people = [];
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
        this.$log.debug('contacts/show/people - nested includes would be nice here');
        this.api.get(`contacts/${this.contact.id}/people`, {include: 'email_addresses,facebook_accounts,family_relationships,linkedin_accounts,master_person,phone_numbers,twitter_accounts,websites'}).then((data) => {
            this.$log.debug('selected people: ', data);
            this.people = data;
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
