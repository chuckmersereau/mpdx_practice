import { assign, concat, difference, find, get, keys, reduce, toString } from 'lodash/fp';
import joinComma from '../fp/joinComma';
import reduceObject from '../fp/reduceObject';
import replaceUnderscore from '../fp/replaceUnderscore';

class ServerConstantsService {
    constructor(
        $log, $q,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;

        this.data = {};
    }
    load(constants = []) {
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
    handleSpecialKeys(key, value) {
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
    mapUnderscore(obj) {
        const objKeys = keys(obj);
        return reduce((result, key) => {
            result[toString(replaceUnderscore(key))] = obj[key];
            return result;
        }, {}, objKeys);
    }
    mapFrequencies(obj) {
        return reduce((result, value) => {
            value.key = parseFloat(value.key);
            return concat(result, value);
        }, [], obj);
    }
    getPledgeFrequency(freq) {
        return freq ? find({ key: parseFloat(freq) }, this.data.pledge_frequency_hashes) : null;
    }
    getPledgeFrequencyValue(freq) {
        return get('value', this.getPledgeFrequency(freq));
    }
}

import api from '../api/api.service';

export default angular.module('mpdx.common.serverConstants', [
    api
]).service('serverConstants', ServerConstantsService).name;

