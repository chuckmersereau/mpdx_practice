import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import difference from 'lodash/fp/difference';
import filter from 'lodash/fp/filter';
import findIndex from 'lodash/fp/findIndex';
import isArray from 'lodash/fp/isArray';
import isEqual from 'lodash/fp/isEqual';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import sortBy from 'lodash/fp/sortBy';
import toInteger from 'lodash/fp/toInteger';

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
            data = defaultTo([], response);
            data = sortBy(filter => toInteger(filter.id), data);
            this.$log.debug(url, data);
            defaultParams = reduce((result, filter) => {
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
            params = assign(defaultParams, params);
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
    // Invert the selected options of a multiselect filter
    invertMultiselect(filter, params) {
        const allOptions = map('id', filter.options);
        let selectedOptions = params[filter.name];

        let allOption = '';
        if (filter.name === 'status') {
            allOption = 'active';
        }

        // If all options are selected other than 'All', then the inverse is 'All'
        if (isEqual(difference(allOptions, selectedOptions), [allOption])) {
            return [''];
        }

        selectedOptions = concat(selectedOptions, allOption); // Exclude the 'All' option when inverting
        return difference(allOptions, selectedOptions);
    }
}


export default angular.module('mpdx.common.filters', [])
    .service('filters', Filters).name;