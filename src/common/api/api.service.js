import config from 'config';
import japi from 'jsonapi-serializer';

function appendTransform(defaults, transform) {
    // We can't guarantee that the default transformation is an array
    defaults = _.isArray(defaults) ? defaults : [defaults];

    // Append the new transformation to the defaults
    return defaults.concat(transform);
}

class Api {
    constructor(
        $http, $cacheFactory, $log, $q, $timeout,
    ) {
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.$timeout = $timeout;

        this.apiUrl = config.apiUrl;
        this.apiCache = $cacheFactory('api');
        this.account_list_id = null;
        this.entityAttributes = new entityAttributes().attributes;

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
            transformRequest: (data) => {
                let key = null;
                let params = {keyForAttribute: 'underscore_case'};
                if (method === 'put') {
                    let arr = url.split('/');
                    key = arr[arr.length - 2];
                    params.attributes = _.get(this.entityAttributes, key, null);
                    if (!params.attributes) {
                        this.$log.error(`undefined attributes for model: ${key} in api.service`);
                    }
                }
                return angular.toJson(new japi.Serializer(key, params).serialize(data));
            },
            transformResponse: appendTransform(this.$http.defaults.transformResponse, (data) => {
                const meta = data.meta || {};
                if (!_.isString(data)) {
                    return new japi.Deserializer({keyForAttribute: 'underscore_case'}).deserialize(data).then((data) => {
                        data.meta = meta;
                        return data;
                    });
                } else {
                    return {};
                }
            }),
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

class entityAttributes {
    constructor() {
        this.attributes = {
            'people': ["first_name", "legal_first_name", "last_name", "birthday_month", "birthday_year", "birthday_day", "anniversary_month", "anniversary_year", "anniversary_day", "title",
                "suffix", "gender", "marital_status", "preferences", "sign_in_count", "current_sign_in_at", "last_sign_in_at", "current_sign_in_ip", "last_sign_in_ip", "created_at", "updated_at",
                "master_person_id", "middle_name", "access_token", "profession", "deceased", "subscribed_to_updates", "optout_enewsletter", "occupation", "employer", "not_duplicated_with"],
            'tasks': ["account_list_id", "starred", "location", "subject", "start_at", "end_at", "type", "created_at", "updated_at", "completed", "activity_comments_count", "activity_type", "result",
                "completed_at", "notification_id", "remote_id", "source", "next_action", "no_date", "notification_type", "notification_time_before", "notification_time_unit", "notification_scheduled"]
        };
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
