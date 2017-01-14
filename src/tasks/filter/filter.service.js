class TasksFilterService {
    api;
    constructor(
        $location, $log, $rootScope,
        api
    ) {
        this.$location = $location;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;

        this.data = [];
        this.params = {};
        this.wildcard_search = '';
        this.default_params = {};
        this.loading = true;

        let query = $location.search().q;
        if (query) {
            this.wildcard_search = query;
        }

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        this.load();
    }
    load() {
        return this.api.get('tasks/filters').then((data) => {
            this.data = data;
            this.data = _.sortBy(this.data, ['id']);
            this.$log.debug('tasks/filters', this.data);
            let params = {};
            _.each(this.data, (obj) => {
                if (obj.multiple && !_.isArray(obj.default_selection)) {
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
                    this.data = _.reject(this.data, comparator => _.eq(obj, comparator));
                }
            });
            this.default_params = _.clone(params);
            this.params = params;
            this.mergeParamsFromLocation();
        });
    }
    mergeParamsFromLocation() {
        _.each(this.$location.search(), (value, param) => {
            if (param.indexOf('filters[') === 0) {
                const filter = param.slice(param.indexOf('[') + 1, param.indexOf(']'));
                if (this.default_params[filter] instanceof Array && !(value instanceof Array)) {
                    this.params[filter] = value.split();
                } else {
                    this.params[filter] = value;
                }
            }
        });
    }
    count() {
        return _.filter(_.keys(this.params), key => !_.isEqual(this.params[key], this.default_params[key])).length;
    }
    reset() {
        this.params = _.clone(this.default_params);
        this.change(this.params);
    }
    change(params) {
        this.$rootScope.$emit('taskFilterChange', params);
    }
    isResettable() {
        return !_.eq(this.params, this.default_params);
    }
}
export default angular.module('mpdx.tasks.filter.service', [])
    .service('tasksFilter', TasksFilterService).name;
