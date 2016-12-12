class ContactsSearchController {
    contacts;
    filterService;

    constructor(filterService, contacts) {
        this.contacts = contacts;
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
