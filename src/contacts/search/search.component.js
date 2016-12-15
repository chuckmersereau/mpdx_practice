class ContactsSearchController {
    contactsService;
    contactFilter;

    constructor(contactFilter, contactsService) {
        this.contactsService = contactsService;
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
