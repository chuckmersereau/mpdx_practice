import has from 'lodash/fp/has';
import unionBy from 'lodash/fp/unionBy';

class ListController {
    constructor(
        $log, $rootScope, $state, $stateParams,
        api, contacts, contactFilter
    ) {
        this.$log = $log;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.api = api;
        this.contactFilter = contactFilter;
        this.contacts = contacts;

        this.data = [];
        this.loading = false;
        this.page = 0;
        this.searchText = null;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        $rootScope.$on('contactsFilterChange', () => {
            this.load();
        });
    }
    $onInit() {
        this.listLoadCount = 0;
        this.selected = this.$stateParams.contactId;
        this.scrollParent = angular.element('#sidebarScrollParent');
    }
    switchContact(id) {
        this.selected = id;
        this.$state.go('contacts.show', {contactId: id});
    }
    loadMoreContacts() {
        if (this.loading || (has('pagination.total_pages', this.meta) && this.page >= this.meta.pagination.total_pages)) {
            return;
        }
        this.load(this.page + 1);
    }
    load(page = 1) {
        const reset = page === 1;
        if (!reset && this.data.length > 0 && page <= this.page) {
            return;
        }
        this.loading = true;
        let currentCount;
        this.page = page;
        if (reset) {
            this.meta = {};
            this.listLoadCount++;
            this.data = [];
            currentCount = angular.copy(this.listLoadCount);
        }
        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.contacts.buildFilterParams(),
                fields: {
                    contacts: 'name'
                },
                page: this.page,
                per_page: 50,
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then(data => {
            this.$log.debug(`contacts sidebar list page ${this.page}`, data);
            if (reset && currentCount !== this.listLoadCount) {
                return;
            }
            this.meta = data.meta;
            const newContacts = angular.copy(data);
            this.data = reset ? newContacts : unionBy('id', this.data, newContacts);
            this.loading = false;
        });
    }
    search() {
        this.load();
    }
}

const List = {
    template: require('./list.html'),
    controller: ListController
};

import contacts from '../../contacts.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.contacts.sidebar.list.component', [
    uiRouter,
    contacts
]).component('contactsSidebarList', List).name;