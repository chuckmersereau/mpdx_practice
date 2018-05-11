import contactFilter, { ContactFilterService } from '../../sidebar/filter/filter.service';

class ContactsSearchController {
    searchParams: string;
    watcher: () => void;
    constructor(
        $rootScope: ng.IRootScopeService,
        private contactFilter: ContactFilterService
    ) {
        this.searchParams = '';

        this.watcher = $rootScope.$on('contactSearchReset', () => {
            this.searchParams = '';
        });
    }
    $onInit() {
        this.searchParams = angular.copy(this.contactFilter.wildcardSearch);
    }
    $onDestroy() {
        this.watcher();
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

export default angular.module('mpdx.contacts.list.search', [
    contactFilter
]).component('contactsListSearch', Search).name;
