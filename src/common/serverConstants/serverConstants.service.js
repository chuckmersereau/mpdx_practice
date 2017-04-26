import replaceUnderscore from '../fp/replaceUnderscore';
import keys from 'lodash/fp/keys';
import reduce from 'lodash/fp/reduce';
import toString from 'lodash/fp/toString';

class ServerConstantsService {
    api;

    constructor(
        $log, $q,
        api, pledgeFrequencyToStrFilter
    ) {
        this.$log = $log;
        this.$q = $q;

        this.api = api;
        this.pledgeFrequencyToStrFilter = pledgeFrequencyToStrFilter;

        this.data = null;
    }
    load(reset = false) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }

        return this.api.get('constants').then((data) => {
            this.$log.debug('constants', data);
            data.dates = this.mapUnderscore(data.dates);
            data.languages = this.mapUnderscore(data.languages);
            data.locales = this.mapUnderscore(data.locales);
            data.notifications = this.mapUnderscore(data.notifications);
            data.organizations = this.mapUnderscore(data.organizations);
            data.organizations_attributes = this.mapUnderscore(data.organizations_attributes);
            data.pledge_frequencies = this.mapFreqencies(data.pledge_frequencies);
            this.data = data;
            return data;
        });
    }

    mapUnderscore(obj) {
        const objKeys = keys(obj);
        return reduce((result, key) => {
            result[toString(replaceUnderscore(key))] = obj[key];
            return result;
        }, {}, objKeys);
    }

    mapFreqencies(obj) {
        const objKeys = keys(obj);
        return reduce((result, key) => {
            result[toString(parseFloat(key))] = this.pledgeFrequencyToStrFilter(key);
            return result;
        }, {}, objKeys);
    }
}

export default angular.module('mpdx.common.serverConstants', [])
    .service('serverConstants', ServerConstantsService).name;
