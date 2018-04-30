class ContactsSearchController {
    searchParams: string;
    constructor(
        $rootScope: ng.IRootScopeService,
        private contactFilter: ContactFilterService
    ) {
        this.searchParams = '';

        $rootScope.$on('contactSearchReset', () => {
            this.searchParams = '';
        });
    }
    $onInit() {
        this.searchParams = angular.copy(this.contactFilter.wildcardSearch);
    }
    paramChanged() {
        this.contactFilter.wildcardSearch = this.searchParams;
        this.contactFilter.change();
    }
}
const Search = {
    controller: ContactsSearchController,
    template: require('./search.html')
};

import contactFilter, { ContactFilterService } from '../../sidebar/filter/filter.service';

export default angular.module('mpdx.contacts.list.search', [
    contactFilter
]).component('contactsListSearch', Search).name;
