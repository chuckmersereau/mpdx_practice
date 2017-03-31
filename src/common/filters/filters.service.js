import concat from 'lodash/fp/concat';
import filter from 'lodash/fp/filter';
import findIndex from 'lodash/fp/findIndex';
import isArray from 'lodash/fp/isArray';
import isEqual from 'lodash/fp/isEqual';
import keys from 'lodash/fp/keys';
import reduce from 'lodash/fp/reduce';
import sortBy from 'lodash/fp/sortBy';

class Filters {
    api;
    constructor(
        $q, $log,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;
    }
    count({params, defaultParams}) {
        return filter(key => !isEqual(params[key], defaultParams[key]), keys(params)).length;
    }
    load({data, defaultParams, params, url}) {
        if (data) {
            return this.$q.resolve({
                data: data,
                params: params,
                defaultParams: defaultParams
            });
        }
        return this.api.get(url, {filter: {account_list_id: this.api.account_list_id}}).then((response) => {
            data = response || [];
            data = sortBy('id', data);
            this.$log.debug(url, data);
            params = reduce((result, filter) => {
                if (filter.multiple && !isArray(filter.default_selection)) {
                    result[filter.name] = [filter.default_selection];
                } else {
                    result[filter.name] = filter.default_selection;
                }
                return result;
            }, {}, data);
            data = reduce((result, filter) => {
                if (filter.parent !== null) {
                    let parentIndex = findIndex(parent => parent.title === filter.parent && parent.type === 'container', result);
                    if (parentIndex === -1) {
                        const parentObj = {title: filter.parent, type: 'container', priority: filter.priority, children: [filter]};
                        result = concat(result, parentObj);
                    } else {
                        result[parentIndex].children = concat(result[parentIndex].children, filter);
                    }
                } else {
                    result = concat(result, filter);
                }
                return result;
            }, [], data);
            defaultParams = angular.copy(params);
            return {
                data: data,
                params: params,
                defaultParams: defaultParams
            };
        });
    }
    reset({defaultParams, params, onChange}) {
        params = angular.copy(defaultParams);
        onChange(params);
        return params;
    }
}


export default angular.module('mpdx.common.filters', [])
    .service('filters', Filters).name;