import assign from 'lodash/fp/assign';
import compact from 'lodash/fp/compact';
import isArray from 'lodash/fp/isArray';
import isEmpty from 'lodash/fp/isEmpty';

class FilterService {
    constructor(
        $rootScope,
        api, contactsTags, filters
    ) {
        this.$rootScope = $rootScope;
        this.api = api;
        this.contactsTags = contactsTags;
        this.filters = filters;

        this.data = null;
        this.params = {};
        this.wildcard_search = '';
        this.default_params = {};
        this.loading = true;
    }
    load(reset = false) {
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
    count() {
        return this.filters.count({ defaultParams: this.default_params, params: this.params })
            + this.contactsTags.selectedTags.length
            + this.contactsTags.rejectedTags.length;
    }
    reset(stateParams = null) {
        this.params = angular.copy(this.default_params);
        this.$rootScope.$emit('contactSearchReset');
        this.contactsTags.reset();
        if (stateParams) {
            this.params = assign(this.params, stateParams);
        }
        this.wildcard_search = '';
        this.change();
    }
    change(filter) {
        this.handleFilterChange(filter);
        this.$rootScope.$emit('contactsFilterChange');
    }
    handleFilterChange(filter) {
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
    isResettable() {
        return !angular.equals(this.params, this.default_params)
            || this.contactsTags.isResettable()
            || !isEmpty(this.wildcard_search);
    }
    invertMultiselect(filter) {
        const reverseName = `reverse_${filter.name}`;
        if (this.params[reverseName]) {
            delete this.params[reverseName];
        } else {
            this.params[reverseName] = true;
        }
        filter.reverse = !!this.params[reverseName];
        this.change();
    }
    removeFilter(filter) {
        const reverseName = `reverse_${filter.name}`;
        this.params[filter.name] = this.default_params[filter.name];
        delete this.params[reverseName];
        filter.reverse = false;
    }
}

import api from 'common/api/api.service';
import contactsTags from './tags/tags.service';
import filters from 'common/filters/filters.service';

export default angular.module('mpdx.contacts.sidebar.filter.service', [
    api, contactsTags, filters
]).service('contactFilter', FilterService).name;
