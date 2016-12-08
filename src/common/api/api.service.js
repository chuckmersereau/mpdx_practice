import config from 'config';

class Api {
    constructor($http, $cacheFactory, $log, $q, $timeout) {
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.$timeout = $timeout;

        this.apiUrl = config.apiUrl;
        this.apiCache = $cacheFactory('api');
        this.account_list_id = null;

        // This function supports both callbacks (successFn, errorFn) and returns a promise
        // It would be preferred to use promises in the future
    }
    call({
        method,
        url,
        data = {},
        cache,
        params,
        headers = {},
        promise = null,
        attempts = 0,
        overrideGetAsPost = false
    }) {
        if (!promise) {
            promise = this.$q.defer();
        }
        if (cache === true) {
            const cachedData = this.apiCache.get(url);
            if (angular.isDefined(cachedData)) {
                return this.$q.resolve(cachedData);
            }
        }

        if (data.filters) {
            _.forIn(data.filters, (val, key) => {
                data[`filter[${key}]`] = val;
            });
            delete data.filters;
        }

        if (method === 'get' || method === 'delete') {
            params = data;
        }

        if (overrideGetAsPost) {
            headers['X-HTTP-Method-Override'] = 'POST';
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
        this.$http(request).then((response) => {
            if (cache === true) {
                this.apiCache.put(url, response.data);
            }
            promise.resolve(response.data);
        }).catch((response) => {
            //check that authentication has happened
            if (response === 'noAuth' && attempts < 3) {
                //wait 1s and retry up to 3 times
                this.$timeout(() => {
                    this.call({ method: method, url: url, data: data, cache: cache, params: params, headers: headers, promise: promise, attempts: attempts + 1 });
                }, 1000);
            } else {
                this.$log.error('API ERROR:', response.status, response.data);
                promise.reject(response);
            }
        });

        return promise.promise;
    }
    get(...params) {
        params = this.handleParamsAsOther(params);
        _.extend(params, { method: 'get' });
        return this.call(params);
    }
    post(...params) {
        params = this.handleParamsAsOther(params);
        _.extend(params, { method: 'post' });
        return this.call(params);
    }
    put(...params) {
        params = this.handleParamsAsOther(params);
        _.extend(params, { method: 'put' });
        return this.call(params);
    }
    delete(...params) {
        params = this.handleParamsAsOther(params);
        _.extend(params, { method: 'delete' });
        return this.call(params);
    }
    handleParamsAsOther(params) {
        if (params.length === 1 && _.isObject(params[0])) {
            return params[0];
        }
        if (_.isArray(params)) {
            params = { url: params[0], data: params[1] || {} };
        }
        return params;
    }
    encodeURLarray(array) {
        return _.map(array, encodeURIComponent);
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
