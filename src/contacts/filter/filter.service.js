class FilterService {
    api;
    filters;

    constructor(
        $location, $rootScope,
        api, filters
    ) {
        this.$location = $location;
        this.$rootScope = $rootScope;
        this.api = api;
        this.filters = filters;

        this.data = null;
        this.params = {};
        this.wildcard_search = '';
        this.default_params = {};
        this.loading = true;

        let query = $location.search().q;
        if (query) {
            this.wildcard_search = query;
        }
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
        return this.filters.count({ defaultParams: this.default_params, params: this.params });
    }
    reset() {
        this.params = angular.copy(this.default_params);
        this.$rootScope.$emit('contactSearchReset');
        this.change();
    }
    change() {
        this.$rootScope.$emit('contactParamChange');
    }
    isResettable() {
        return !angular.equals(this.params, this.default_params);
    }
}
export default angular.module('mpdx.services.filter', [])
    .service('contactFilter', FilterService).name;
