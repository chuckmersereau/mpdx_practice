import assign from 'lodash/fp/assign';

class FilterService {
    api;
    filters;

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
        }).then(({data, defaultParams, params}) => {
            this.data = data;
            this.default_params = defaultParams;
            this.params = params;
        });
    }
    count() {
        return this.filters.count({ defaultParams: this.default_params, params: this.params }) + this.contactsTags.selectedTags.length + this.contactsTags.rejectedTags.length;
    }
    reset(stateParams = null) {
        this.params = angular.copy(this.default_params);
        this.$rootScope.$emit('contactSearchReset');
        this.contactsTags.reset();
        if (stateParams) {
            this.params = assign(this.params, stateParams);
        }
        this.change();
    }
    change() {
        this.$rootScope.$emit('contactsFilterChange');
    }
    isResettable() {
        return !angular.equals(this.params, this.default_params) || this.contactsTags.isResettable();
    }
}

import api from '../../../common/api/api.service';
import contactsTags from './tags/tags.service';
import filters from '../../../common/filters/filters.service';

export default angular.module('mpdx.services.filter', [
    api, contactsTags, filters
]).service('contactFilter', FilterService).name;
