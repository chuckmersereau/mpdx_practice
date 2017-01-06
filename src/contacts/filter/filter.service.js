class FilterService {
    api;

    constructor(
        $location, $log, $rootScope,
        api
    ) {
        this.$location = $location;
        this.$log = $log;
        this.api = api;

        this.data = [];
        this.params = {};
        this.wildcard_search = '';
        this.default_params = {};
        this.resettable = false;
        this.lastAccountId = null; //Hack to stop dupe calls on repeat account swap
        this.loading = true;

        let query = $location.search().q;
        if (query) {
            this.wildcard_search = query;
        }

        $rootScope.$watch(() => this.params, () => {
            this.resettable = !_.eq(this.params, this.default_params);
        }, true);

        $rootScope.$on('accountListUpdated', (e, accountId) => {
            if (accountId && this.lastAccountId !== accountId) {
                this.lastAccountId = accountId;
                this.load();
            }
        });
    }
    load() {
        return this.api.get(`contacts/filters`).then((data) => {
            this.data = data || [];
            this.data = _.sortBy(this.data, ['id']);
            this.$log.debug('contacts/filters:', data);

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
        }).catch((ex) => {
            console.error('contacts/filter.service');
            return ex;
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
export default angular.module('mpdx.services.filter', [])
    .service('contactFilter', FilterService).name;
