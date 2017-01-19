class Filters {
    api;
    constructor(
        $location, $q, $log,
        api
    ) {
        this.$location = $location;
        this.$log = $log;
        this.$q = $q;
        this.api = api;
    }
    count({params, defaultParams}) {
        return _.filter(_.keys(params), key => !_.isEqual(params[key], defaultParams[key])).length;
    }
    load({data, defaultParams, params, url}) {
        if (data) {
            return this.$q.resolve();
        }
        return this.api.get(url).then((response) => {
            data = response || [];
            data = _.sortBy(data, ['id']);
            this.$log.debug(url, data);

            let returnParams = {};
            _.each(data, (obj) => {
                if (obj.multiple && !_.isArray(obj.default_selection)) {
                    returnParams[obj.name] = [obj.default_selection];
                } else {
                    returnParams[obj.name] = obj.default_selection;
                }
                if (obj.parent !== null) {
                    let parentObj = _.find(data, parent => parent.title === obj.parent && parent.type === 'container');
                    if (!parentObj) {
                        parentObj = {title: obj.parent, type: 'container', priority: obj.priority, children: []};
                        data.push(parentObj);
                    }
                    parentObj.children.push(obj);
                    data = _.reject(data, comparator => _.eq(obj, comparator));
                }
            });
            defaultParams = _.clone(returnParams);
            params = returnParams;
            this.mergeParamsFromLocation(defaultParams, params);
            return {
                data: data,
                params: params,
                defaultParams: defaultParams
            };
        });
    }
    mergeParamsFromLocation(defaultParams, params) {
        _.each(this.$location.search(), (value, param) => {
            if (param.indexOf('filters[') === 0) {
                const filter = param.slice(param.indexOf('[') + 1, param.indexOf(']'));
                if (defaultParams[filter] instanceof Array && !(value instanceof Array)) {
                    params[filter] = value.split();
                } else {
                    params[filter] = value;
                }
            }
        });
    }
    reset({defaultParams, params, onChange}) {
        params = _.clone(defaultParams);
        onChange(params);
        return params;
    }
}


export default angular.module('mpdx.common.filters', [])
    .service('filters', Filters).name;