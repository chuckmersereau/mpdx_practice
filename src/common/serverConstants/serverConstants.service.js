import replaceUnderscore from '../fp/replaceUnderscore';
import keys from 'lodash/fp/keys';
import reduce from 'lodash/fp/reduce';
import toString from 'lodash/fp/toString';

const mapUnderscore = (obj) => {
    const objKeys = keys(obj);
    return reduce((result, key) => {
        result[toString(replaceUnderscore(key))] = obj[key];
        return result;
    }, {}, objKeys);
};

const mapFloats = (obj) => {
    const objKeys = keys(obj);
    return reduce((result, key) => {
        result[toString(parseFloat(key))] = obj[key];
        return result;
    }, {}, objKeys);
};

class ServerConstantsService {
    api;

    constructor(
        api,
        $log, $q
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;

        this.data = null;
    }
    load(reset = false) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }

        return this.api.get('constants').then((data) => {
            this.$log.debug('constants', data);
            data.dates = mapUnderscore(data.dates);
            data.languages = mapUnderscore(data.languages);
            data.locales = mapUnderscore(data.locales);
            data.notifications = mapUnderscore(data.notifications);
            data.organizations = mapUnderscore(data.organizations);
            data.organizations_attributes = mapUnderscore(data.organizations_attributes);
            data.pledge_frequencies = mapFloats(data.pledge_frequencies);
            this.data = data;
            return data;
        });
    }
}

export default angular.module('mpdx.common.serverConstants', [])
    .service('serverConstants', ServerConstantsService).name;
