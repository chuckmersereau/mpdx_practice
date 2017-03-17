class ContactsSearchController {
    contacts;
    contactFilter;

    constructor(
        $state, $timeout,
        contacts, contactFilter
    ) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.contacts = contacts;
        this.contactFilter = contactFilter;

        this.searchParams = '';
    }
    reset() {
        this.$timeout(() => {
            this.searchParams = '';
        }, 200);
    }
    go(contactId) {
        this.searchParams = '';
        this.$state.go('contacts.show', {contactId: contactId});
    }
    gotoList() {
        this.contactFilter.params.wildcard_search = angular.copy(this.searchParams);
        this.$state.go('contacts', {}, {reload: true});
        this.searchParams = '';
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html')
};

export default angular.module('mpdx.menu.search.component', [])
    .component('menuSearch', Search).name;
