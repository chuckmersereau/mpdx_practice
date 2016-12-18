class ContactsSearchController {
    contacts;
    contactFilter;

    constructor(contactFilter, contacts) {
        this.contacts = contacts;
        this.contactFilter = contactFilter;

        this.searchParams = '';
    }
    paramChanged() {
        this.contactFilter.params.wildcard_search = this.searchParams;
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html'),
    bindings: {
        dropdown: '<',
        showFilters: '@'
    }
};

export default angular.module('mpdx.common.contacts.search', [])
    .component('contactsSearch', Search).name;
