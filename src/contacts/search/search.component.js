class ContactsSearchController {
    contacts;
    contactFilter;

    constructor(contactFilter, contacts) {
        this.contacts = contacts;
        this.contactFilter = contactFilter;

        this.searchParams = '';
    }
    $onInit() {
        this.searchParams = angular.copy(this.contactFilter.params.wildcard_search);
    }
    paramChanged() {
        this.contactFilter.params.wildcard_search = this.searchParams;
        this.contactFilter.change();
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html')
};

export default angular.module('mpdx.common.contacts.search', [])
    .component('contactsSearch', Search).name;
