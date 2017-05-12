import defaultTo from 'lodash/fp/defaultTo';
import has from 'lodash/fp/has';
import unionBy from 'lodash/fp/unionBy';

class ListController {
    constructor(
        $log, $rootScope, $state, $stateParams,
        api, contacts
    ) {
        this.$log = $log;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.api = api;
        this.contacts = contacts;

        this.data = [];
        this.loading = false;
        this.page = 0;

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });

        $rootScope.$on('contactsFilterChange', () => {
            this.load(true);
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
        this.load(false, this.page + 1);
    }
    load(reset = false, page = 0) {
        if (!reset && this.data.length > 0 && page <= this.page) {
            return;
        }
        this.loading = true;
        let currentCount;
        if (reset) {
            this.page = 1;
            this.meta = {};
            this.listLoadCount++;
            this.data = [];
            currentCount = angular.copy(this.listLoadCount);
        } else {
            this.page = page;
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
        }).then((data) => {
            this.$log.debug(`contacts sidebar list page ${this.page}`, data);
            if (reset && currentCount !== this.listLoadCount) {
                return;
            }
            this.meta = data.meta;
            let count = defaultTo(0, this.meta.to);
            const newContacts = angular.copy(data);
            this.data = reset ? newContacts : unionBy('id', this.data, newContacts);
            count += data.length;
            this.meta.to = count;
            this.loading = false;
        });
    }
}

const List = {
    template: require('./list.html'),
    controller: ListController
};

import contacts from '../../contacts.service';
import uiRouter from 'angular-ui-router';

export default angular.module('mpdx.contacts.sidebar.list.component', [
    uiRouter,
    contacts
]).component('contactsSidebarList', List).name;