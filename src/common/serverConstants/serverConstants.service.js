import replaceUnderscore from '../fp/replaceUnderscore';
import each from 'lodash/fp/each';
import keys from 'lodash/fp/keys';
import toString from 'lodash/fp/toString';

const mapUnderscore = (obj) => {
    let newObj = {};
    const objKeys = keys(obj);
    each(key => {
        newObj[toString(replaceUnderscore(key))] = obj[key];
    }, objKeys);
    return newObj;
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
            data.languages = mapUnderscore(data.languages);
            data.locales = mapUnderscore(data.locales);
            data.organizations = mapUnderscore(data.organizations);
            this.data = data;
            return data;
        });
    }
}

export default angular.module('mpdx.common.serverConstants', [])
    .service('serverConstants', ServerConstantsService).name;
