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
        this.searchParams = angular.copy(this.contactFilter.wildcard_search);
    }
    paramChanged() {
        this.contactFilter.wildcard_search = this.searchParams;
        this.contactFilter.change();
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html')
};

import contacts from '../../contacts.service';

export default angular.module('mpdx.contacts.list.search', [
    contacts
]).component('contactsListSearch', Search).name;
