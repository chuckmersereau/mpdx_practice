import * as moment from 'moment';
import { ApiService } from '../../../common/api/api.service';
import { ContactFilterService } from '../filter/filter.service';
import { has, unionBy } from 'lodash/fp';
import { StateParams, StateService } from '@uirouter/core';
import contacts, { ContactsService } from '../../contacts.service';
import uiRouter from '@uirouter/angularjs';

class ListController {
    data: any;
    listLoadCount: number;
    loading: boolean;
    meta: any;
    page: number;
    searchText: string;
    selected: string;
    watcher: () => void;
    watcher2: () => void;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private $stateParams: StateParams,
        private api: ApiService,
        private contacts: ContactsService,
        private contactFilter: ContactFilterService
    ) {
        this.data = [];
        this.loading = false;
        this.page = 0;
        this.searchText = null;
    }
    $onInit() {
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        this.watcher2 = this.$rootScope.$on('contactsFilterChange', () => {
            this.load();
        });
        this.listLoadCount = 0;
        this.selected = this.$stateParams.contactId;
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
    }
    switchContact(id) {
        this.selected = id;
        this.$state.go(this.$state.$current.name, { contactId: id });
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
                    contacts: 'name,status,late_at'
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
            const newContacts = angular.copy(data);
            this.data = reset ? newContacts : unionBy('id', this.data, newContacts);
            this.loading = false;
        });
    }
    search() {
        this.load();
    }
    daysLate(contact) {
        return moment().diff(moment(contact.late_at), 'days') || 0;
    }
}

const List = {
    template: require('./list.html'),
    controller: ListController
};

export default angular.module('mpdx.contacts.sidebar.list.component', [
    uiRouter,
    contacts
]).component('contactsSidebarList', List).name;
