import {
    assign,
    concat,
    defaultTo,
    filter,
    find,
    findIndex,
    get,
    isArray,
    isEqual,
    keys,
    reduce,
    sortBy,
    toInteger
} from 'lodash/fp';
import reduceObject from '../fp/reduceObject';
import { split } from '../fp/strings';

export class FiltersService {
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private api: ApiService
    ) {}
    count({ params, defaultParams }) {
        return filter((key) => !isEqual(params[key], defaultParams[key]), keys(params)).length;
    }
    load({ data, defaultParams, params, url }): ng.IPromise<any> {
        return data
            ? this.returnOriginalAsPromise(data, params, defaultParams)
            : this.getDataFromApi(data, defaultParams, params, url);
    }
    returnOriginalAsPromise(data, params, defaultParams): ng.IPromise<any> {
        return this.$q.resolve({
            data: data,
            params: params,
            defaultParams: defaultParams
        });
    }
    getDataFromApi(data: any, defaultParams: any, params: any, url: string) {
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
    fromStrings(params, filters) {
        return reduceObject((result, value, key) => {
            const filter = find({ name: key }, filters);
            const isMultiselect = get('type', filter) === 'multiselect';
            result[key] = isMultiselect ? split(',', value) : value;
            return result;
        }, {}, params);
    }
}

import api, { ApiService } from '../api/api.service';

export default angular.module('mpdx.common.filters.service', [
    api
]).service('filters', FiltersService).name;
