class ContactsSearchController {
    contactsService;
    filterService;

    constructor(filterService, contactsService) {
        this.contactsService = contactsService;
        this.filterService = filterService;

        this.searchParams = '';
    }
    paramChanged() {
        this.filterService.params.wildcard_search = this.searchParams;
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
