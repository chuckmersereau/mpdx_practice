import config from 'config';

class Api {
    constructor($http, $cacheFactory, $log, $q, $timeout) {
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.$timeout - $timeout;

        this.apiUrl = config.apiUrl;
        this.apiCache = $cacheFactory('api');
        this.account_list_id = null;

        // This function supports both callbacks (successFn, errorFn) and returns a promise
        // It would be preferred to use promises in the future
    }
    call(method, url, data = {}, successFn, errorFn, cache, params, headers, attempts = 0) {
        if (cache === true) {
            const cachedData = this.apiCache.get(url);
            if (angular.isDefined(cachedData)) {
                if (_.isFunction(successFn)) {
                    successFn(cachedData, 304);
                }
                return this.$q.resolve(cachedData);
            }
        }
        if (this.account_list_id !== null) {
            data.account_list_id = this.account_list_id;
        }
        if (method === 'get' || method === 'delete') {
            params = data;
        }
        const request = {
            method: method,
            url: this.apiUrl + url,
            data: data,
            params: params,
            headers: headers,
            paramSerializer: '$httpParamSerializerJQLike',
            cacheService: false,
            timeout: 50000
        };
        return this.$http(request).then((response) => {
            if (_.isFunction(successFn)) {
                successFn(response.data, response.status);
            }
            if (cache === true) {
                this.apiCache.put(url, response.data);
            }
            return response.data;
        }).catch((response) => {
            //check that authentication has happened
            if (response === 'noAuth' && attempts < 3) {
                //wait 1s and retry up to 3 times
                this.$timeout(() => {
                    return this.call(method, url, data, successFn, errorFn, cache, params, headers, attempts + 1);
                }, 1000)
            } else {
                this.$log.error('API ERROR:', response.status, response.data);
                if (_.isFunction(errorFn)) {
                    errorFn(response);
                }
                return this.$q.reject(response);
            }
        });
    }
    get(url, data, successFn, errorFn, cache) {
        return this.call('get', url, data, successFn, errorFn, cache);
    }
    post(url, data, successFn, errorFn, cache) {
        return this.call('post', url, data, successFn, errorFn, cache);
    }
    put(url, data, successFn, errorFn, cache) {
        return this.call('put', url, data, successFn, errorFn, cache);
    }
    delete(url, data, successFn, errorFn, cache) {
        return this.call('delete', url, data, successFn, errorFn, cache);
    }
    encodeURLarray(array) {
        return _.map(array, encodeURIComponent);
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
