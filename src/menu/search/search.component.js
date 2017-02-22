class ContactsSearchController {
    contacts;
    contactFilter;

    constructor(
        $state, $timeout,
        contacts
    ) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.contacts = contacts;

        this.searchParams = '';
    }
    reset() {
        this.$timeout(() => {
            this.searchParams = '';
        }, 200);
    }
    go(contactId) {
        this.searchParams = '';
        this.$state.go('contact', {contactId: contactId}, {reload: true});
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html')
};

export default angular.module('mpdx.menu.search.component', [])
    .component('menuSearch', Search).name;
