import { assign, concat, difference, find, get, keys, reduce, toNumber, toString } from 'lodash/fp';
import joinComma from '../fp/joinComma';
import reduceObject from '../fp/reduceObject';
import replaceUnderscore from '../fp/replaceUnderscore';

export class ServerConstantsService {
    data: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private api: ApiService
    ) {
        this.data = {};
    }
    load(constants: string[] = []): ng.IPromise<any> {
        /* istanbul ignore next */
        this.$log.debug('constants requested', constants);
        const differences = difference(constants, keys(this.data));
        /* istanbul ignore next */
        this.$log.debug('constants missing', differences);

        if (differences.length === 0) {
            return this.$q.resolve(this.data);
        }

        return this.api.get('constants', {
            fields: {
                constant_list: joinComma(differences)
            }
        }).then((data) => {
            this.data = assign(this.data, data);
            this.data = reduceObject((result, value, key) => {
                result[key] = this.handleSpecialKeys(key, value);
                return result;
            }, {}, this.data);
            /* istanbul ignore next */
            this.$log.debug('constants', this.data);
            return data;
        });
    }
    private handleSpecialKeys(key: string, value: any): any {
        switch (key) {
            case 'languages':
            case 'locales':
            case 'organizations_attributes':
                return this.mapUnderscore(value);
            case 'pledge_frequency_hashes':
                return this.mapFrequencies(value);
            default:
                return value;
        }
    }
    mapUnderscore(obj: any): any {
        const objKeys = keys(obj);
        return reduce((result, key) => {
            result[toString(replaceUnderscore(key))] = obj[key];
            return result;
        }, {}, objKeys);
    }
    mapFrequencies(obj: any[]): any[] {
        return reduce((result, value) => {
            value.key = parseFloat(value.key);
            return concat(result, value);
        }, [], obj);
    }
    getPledgeFrequency(freq: string | number): any {
        return freq ? find({ key: toNumber(freq) }, this.data.pledge_frequency_hashes) : null;
    }
    getPledgeFrequencyValue(freq: string | number): string {
        return get('value', this.getPledgeFrequency(freq));
    }
    getPledgeCurrencySymbol(code: string): string {
        return get('symbol', find({ code: code }, this.data.pledge_currencies));
    }
}

import api, { ApiService } from '../api/api.service';

export default angular.module('mpdx.common.serverConstants', [
    api
]).service('serverConstants', ServerConstantsService).name;

