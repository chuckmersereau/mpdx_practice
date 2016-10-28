class FilterService {
    api;
    constructor($rootScope, api, $location) {
        this.$location = $location;
        this.api = api;

        this.data = [];
        this.params = {};
        this.wildcard_search = '';
        this.default_params = {};
        this.resettable = false;
        this.loading = true;

        let query = $location.search().q;
        if (query) {
            this.wildcard_search = query;
        }

        $rootScope.$watch(() => {
            return this.params;
        }, () => {
            this.resettable = !angular.equals(this.params, this.default_params);
        }, true);

        $rootScope.$watch(() => {
            return api.account_list_id;
        }, (newVal, oldVal) => {
            if (oldVal && newVal) {
                this.load();
            }
        });

        this.load();
    }
    load() {
        this.loading = true;
        this.api.call('get', 'contacts/filters', {}, (data) => {
            this.data = data.filters;
            this.data = this.data.sort((a, b) => {
                return (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0);
            });
            var params = {};
            angular.forEach(this.data, (obj) => {
                if (obj.multiple === true && !(obj.default_selection instanceof Array)) {
                    params[obj.name] = [obj.default_selection];
                } else {
                    params[obj.name] = obj.default_selection;
                }
                if (obj.parent !== null) {
                    let parentObj = _.find(this.data, (parent) => {
                        return parent.title === obj.parent && parent.type === 'container';
                    });
                    if (angular.isUndefined(parentObj)) {
                        parentObj = {title: obj.parent, type: 'container', priority: obj.priority, children: []};
                        this.data.push(parentObj);
                    }
                    parentObj.children.push(obj);
                    this.data = _.reject(this.data, (comparator) => {
                        return angular.equals(obj, comparator);
                    });
                }
            });
            this.default_params = angular.copy(params);
            this.params = params;
            this.mergeParamsFromLocation();
            this.loading = false;
        });
    }
    mergeParamsFromLocation() {
        angular.forEach(this.$location.search(), (value, param) => {
            if (param.indexOf('filters[') === 0) {
                var filter = param.slice(param.indexOf('[') + 1, param.indexOf(']'));
                if (this.default_params[filter] instanceof Array && !(value instanceof Array)) {
                    this.params[filter] = value.split();
                } else {
                    this.params[filter] = value;
                }
            }
        });
    }
    reset() {
        this.params = angular.copy(this.default_params);
    }
}
export default angular.module('mpdx.services.filter', [])
    .service('filterService', FilterService).name;
