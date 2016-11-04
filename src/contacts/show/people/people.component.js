class ContactPeopleController {
    contact;

    constructor(
        $state, gettextCatalog
    ) {
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;

        this.isMerging = false;
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
            var ids = _.map(data, 'id').join();
            this.$state.go('contact.mergePeople', { contactId: this.contact.id, peopleIds: ids });
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
