import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import filter from 'lodash/fp/filter';
import findIndex from 'lodash/fp/findIndex';
import isArray from 'lodash/fp/isArray';
import isEqual from 'lodash/fp/isEqual';
import keys from 'lodash/fp/keys';
import reduce from 'lodash/fp/reduce';
import sortBy from 'lodash/fp/sortBy';
import toInteger from 'lodash/fp/toInteger';

class Filters {
    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;
    }
    count({ params, defaultParams }) {
        return filter((key) => !isEqual(params[key], defaultParams[key]), keys(params)).length;
    }
    load({ data, defaultParams, params, url }) {
        return data
            ? this.returnOriginalAsPromise(data, params, defaultParams)
            : this.getDataFromApi(data, defaultParams, params, url);
    }
    returnOriginalAsPromise(data, params, defaultParams) {
        return Promise.resolve({
            data: data,
            params: params,
            defaultParams: defaultParams
        });
    }
    getDataFromApi(data, defaultParams, params, url) {
        return this.api.get(url, { filter: { account_list_id: this.api.account_list_id } }).then((response) => {
            data = defaultTo([], response);
            data = sortBy((filter) => toInteger(filter.id), data);
            /* istanbul ignore next */
            this.$log.debug(url, data);
            defaultParams = this.makeDefaultParams(data);
            data = this.mutateData(data);
            params = assign(defaultParams, params);
            return {
                data: data,
                params: params,
                defaultParams: defaultParams
            };
        });
    }
    makeDefaultParams(data) {
        return reduce((result, filter) => {
            if (filter.multiple && !isArray(filter.default_selection)) {
                result[filter.name] = [filter.default_selection];
            } else {
                result[filter.name] = filter.default_selection;
            }
            return result;
        }, {}, data);
    }
    mutateData(data) {
        return reduce((result, filter) => {
            if (filter.parent !== null) {
                let parentIndex = findIndex((parent) => parent.title === filter.parent && parent.type === 'container', result);
                if (parentIndex === -1) {
                    const parentObj = { title: filter.parent, type: 'container', priority: filter.priority, children: [filter] };
                    result = concat(result, parentObj);
                } else {
                    result[parentIndex].children = concat(result[parentIndex].children, filter);
                }
            } else {
                result = concat(result, filter);
            }
            return result;
        }, [], data);
    }
    reset({ defaultParams, params, onChange }) {
        params = angular.copy(defaultParams);
        onChange(params);
        return params;
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.common.filters', [
    api
]).service('filters', Filters).name;
