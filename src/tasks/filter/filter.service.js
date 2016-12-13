class TasksFilterService {
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

        $rootScope.$watch(() => this.params, () => {
            this.resettable = !angular.equals(this.params, this.default_params);
        }, true);

        $rootScope.$watch(() => api.account_list_id, (newVal, oldVal) => {
            if (oldVal && newVal) {
                this.load();
            }
        });

        this.load();
    }
    load() {
        this.loading = true;
        return this.api.get('tasks/filters').then((data) => {
            this.data = data.filters;
            this.data = this.data.sort((a, b) => {
                return (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0);
            });
            let params = {};
            _.each(this.data, (obj) => {
                if (obj.multiple === true && !_.isArray(obj.default_selection)) {
                    params[obj.name] = [obj.default_selection];
                } else {
                    params[obj.name] = obj.default_selection;
                }
                if (obj.parent !== null) {
                    let parentObj = _.find(this.data, parent => parent.title === obj.parent && parent.type === 'container');
                    if (!parentObj) {
                        parentObj = {title: obj.parent, type: 'container', priority: obj.priority, children: []};
                        this.data.push(parentObj);
                    }
                    parentObj.children.push(obj);
                    this.data = _.reject(this.data, (comparator) => angular.equals(obj, comparator));
                }
            });
            this.default_params = _.clone(params);
            this.params = params;
            this.mergeParamsFromLocation();
            this.loading = false;
        });
    }
    mergeParamsFromLocation() {
        _.each(this.$location.search(), (value, param) => {
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
    count() {
        let count = 0;
        for (var key in this.params) {
            if (this.params.hasOwnProperty(key)) {
                if (!_.isEqual(this.params[key], this.default_params[key])) {
                    count++;
                }
            }
        }
        return count;
    }
    reset() {
        this.params = _.clone(this.default_params);
    }
}
export default angular.module('mpdx.tasks.filter.service', [])
    .service('tasksFilterService', TasksFilterService).name;
