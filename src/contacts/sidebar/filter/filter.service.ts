import { assign, compact, isArray, isEmpty } from 'lodash/fp';
import { StateParams } from '@uirouter/core';
import api, { ApiService } from '../../../common/api/api.service';
import contactsTags, { ContactsTagsService } from './tags/tags.service';
import filters, { FiltersService } from '../../../common/filters/filters.service';

export class ContactFilterService {
    data: any;
    default_params: any;
    loading: boolean;
    params: any;
    selectedSave: string;
    wildcardSearch: string;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private api: ApiService,
        private contactsTags: ContactsTagsService,
        private filters: FiltersService
    ) {
        this.data = null;
        this.params = {};
        this.wildcardSearch = '';
        this.default_params = {};
        this.loading = true;
    }
    load(reset: boolean = false): ng.IPromise<any> {
        if (reset) {
            this.data = null;
        }
        return this.filters.load({
            data: this.data,
            defaultParams: this.default_params,
            params: this.params,
            url: 'contacts/filters'
        }).then(({ data, defaultParams, params }) => {
            this.data = data;
            this.default_params = defaultParams;
            this.params = params;
        });
    }
    count(): number {
        return this.filters.count({ defaultParams: this.default_params, params: this.params })
            + this.contactsTags.selectedTags.length
            + this.contactsTags.rejectedTags.length;
    }
    reset(stateParams: StateParams = null): void {
        const defaultParams = angular.copy(this.default_params);
        this.$rootScope.$emit('contactSearchReset');
        this.contactsTags.reset();
        const params = this.filters.fromStrings(stateParams, this.data);
        this.params = assign(defaultParams, params);
        this.wildcardSearch = '';
        this.change();
    }
    change(filter?: any): void {
        this.handleFilterChange(filter);
        this.$rootScope.$emit('contactsFilterChange');
        this.$log.debug('contactFilter: params', this.params);
        this.$log.debug('contactsTags: selectedTags', this.contactsTags.selectedTags);
        this.$log.debug('contactsTags: rejectedTags', this.contactsTags.rejectedTags);
    }
    private handleFilterChange(filter: any): void {
        if (filter) {
            const currentFilter = this.params[filter.name];
            if (isArray(currentFilter) && currentFilter.length > 1) {
                this.params[filter.name] = compact(currentFilter);
            }
            if (isArray(currentFilter) && currentFilter.length === 0) {
                this.params[filter.name] = this.default_params[filter.name];
            }
        }
    }
    isResettable(): boolean {
        return !angular.equals(this.params, this.default_params)
            || this.contactsTags.isResettable()
            || !isEmpty(this.wildcardSearch);
    }
    invertMultiselect(filter: any): void {
        const reverseName = `reverse_${filter.name}`;
        if (this.params[reverseName]) {
            delete this.params[reverseName];
        } else {
            this.params[reverseName] = true;
        }
        filter.reverse = !!this.params[reverseName];
        this.change();
    }
    removeFilter(filter: any): void {
        const reverseName = `reverse_${filter.name}`;
        this.params[filter.name] = this.default_params[filter.name];
        delete this.params[reverseName];
        filter.reverse = false;
    }
}

export default angular.module('mpdx.contacts.sidebar.filter.service', [
    api, contactsTags, filters
]).service('contactFilter', ContactFilterService).name;
