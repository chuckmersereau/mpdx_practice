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
import { split } from '../fp/strings';
import api, { ApiService } from '../api/api.service';
import reduceObject from '../fp/reduceObject';
import replaceAll from '../fp/replaceAll';

export class FiltersService {
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private api: ApiService
    ) {}
    count({ params, defaultParams }: { params: any, defaultParams: any }): number {
        return filter((key) => !isEqual(params[key], defaultParams[key]), keys(params)).length;
    }
    load({ data, defaultParams, params, url }: { data: any, defaultParams: any, params: any, url: string}):
        ng.IPromise<any> {
        return data
            ? this.returnOriginalAsPromise(data, params, defaultParams)
            : this.getDataFromApi(url, params);
    }
    private returnOriginalAsPromise(data: any, params: any, defaultParams: any): ng.IPromise<any> {
        return this.$q.resolve({
            data: data,
            params: params,
            defaultParams: defaultParams
        });
    }
    private getDataFromApi(url: string, params: any): ng.IPromise<any> {
        return this.api.get(url, {
            filter: { account_list_id: this.api.account_list_id }
        }).then((response) => {
            const data = sortBy((filter) => toInteger(filter.id), defaultTo([], response));
            const defaultParams = this.makeDefaultParams(data);
            /* istanbul ignore next */
            this.$log.debug(url, data);
            return {
                data: this.mutateData(data),
                params: assign(angular.copy(defaultParams), params),
                defaultParams: defaultParams
            };
        });
    }
    private makeDefaultParams(data: any): any {
        return reduce((result, filter) => {
            if (filter.type === 'text') {
                result[filter.name] = reduce((result, option) => {
                    result[option.id] = '';
                    return result;
                }, {}, filter.options);
            } else {
                result[filter.name] = this.splitToArr(filter.default_selection);
            }
            return result;
        }, {}, data);
    }
    private mutateData(data: any): any[] {
        return reduce((result, filter) => {
            filter.default_selection = this.splitToArr(filter.default_selection);
            if (filter.parent !== null) {
                let parentIndex = findIndex((parent) =>
                    parent.title === filter.parent && parent.type === 'container'
                    , result);
                if (parentIndex === -1) {
                    const parentObj = {
                        title: filter.parent,
                        type: 'container',
                        priority: filter.priority,
                        children: [filter]
                    };
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
    private splitToArr(selection: string): string[] {
        const defaultSpaceless = replaceAll(', ', ',', selection);
        return split(',', defaultSpaceless);
    }
    reset({ defaultParams, params, onChange }: { defaultParams: any, params: any, onChange: any }): any {
        params = angular.copy(defaultParams);
        onChange(params);
        return params;
    }
    fromStrings(params: any, filters: any): any {
        return reduceObject((result, value, key) => {
            const filter = find({ name: key }, filters);
            const isMultiselect = get('type', filter) === 'multiselect';
            result[key] = isMultiselect ? split(',', value) : value;
            return result;
        }, {}, params);
    }
}

export default angular.module('mpdx.common.filters.service', [
    api
]).service('filters', FiltersService).name;
