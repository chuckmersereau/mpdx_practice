class ContactsSearchController {
    contacts;
    contactFilter;

    constructor(
        $rootScope,
        contactFilter, contacts
    ) {
        this.contacts = contacts;
        this.contactFilter = contactFilter;

        this.searchParams = '';

        $rootScope.$on('contactSearchReset', () => {
            this.searchParams = '';
        });
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
