import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import config from 'config';
import defaultTo from 'lodash/fp/defaultTo';
import { EntityAttributes } from './entities';
import has from 'lodash/fp/has';
import isArray from 'lodash/fp/isArray';
import isNil from 'lodash/fp/isNil';
import isObject from 'lodash/fp/isObject';
import japi from 'jsonapi-serializer';
import joinComma from '../fp/joinComma';
import map from 'lodash/fp/map';
import pull from 'lodash/fp/pull';
import reduceObject from '../fp/reduceObject';

function appendTransform(defaults, transform) {
    // We can't guarantee that the default transformation is an array
    defaults = isArray(defaults) ? defaults : [defaults];

    // Append the new transformation to the defaults
    return concat(defaults, transform);
}

const jsonApiParams = { keyForAttribute: 'underscore_case' };

function isDataObject(data) {
    return isObject(data) && data.data;
}

function deserialize(data, deSerializationOptions) {
    const options = assign(jsonApiParams, deSerializationOptions);
    return isDataObject(data)
        ? new japi.Deserializer(options).deserialize(data).then((deserializedData) => {
            deserializedData.meta = defaultTo({}, data.meta);
            return deserializedData;
        }) : data;
}

function removeIdIfUndefined(serialized, method) {
    if (method === 'post' && serialized.data.id === 'undefined') {
        delete serialized.data.id;
    }
    return serialized;
}

function enablePutOverwrite(serialized, method) {
    if (method === 'put') {
        serialized.data.attributes = defaultTo({}, serialized.data.attributes);
        serialized.data.attributes.overwrite = true;
    }
    return serialized;
}

function serialize(key, params, item, method) {
    let serialized = new japi.Serializer(key, params).serialize(item);
    serialized = removeIdIfUndefined(serialized, method);
    serialized = enablePutOverwrite(serialized, method);
    return serialized;
}

class Api {
    constructor(
        $http, $log, $q, $timeout,
    ) {
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.$timeout = $timeout;

        this.apiUrl = config.apiUrl;
        this.account_list_id = null;
        this.entityAttributes = new EntityAttributes().attributes;
    }
    call({
        method,
        url,
        data = {},
        params = {},
        headers = {},
        overrideGetAsPost = false,
        type = null,
        doSerialization = true,
        deSerializationOptions = {},
        doDeSerialization = true,
        beforeDeserializationTransform = null,
        responseType = ''
    }) {
        let promise = this.$q.defer();

        if (overrideGetAsPost) {
            headers['X-HTTP-Method-Override'] = 'GET';
            method = 'post';
            doSerialization = false;
            if (!type) {
                let arr = url.split('/');
                data.data = { type: arr[arr.length - 1] };
            } else {
                data.data = { type: type };
            }
            data.filter = this.cleanFilters(data.filter);
        }

        if (method === 'get' || method === 'delete') {
            params = assign(params, data);
        }

        // set jsonapi content type
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/vnd.api+json';
        }
        if (!headers.Accept) {
            headers.Accept = 'application/vnd.api+json';
        }

        const request = {
            method: method,
            url: this.apiUrl + url,
            data: data,
            params: params,
            headers: headers,
            paramSerializer: '$httpParamSerializerJQLike',
            responseType: responseType,
            transformRequest: (data) => {
                let params = angular.copy(jsonApiParams);
                if (method === 'put' || (method === 'post' && !overrideGetAsPost) || method === 'delete') {
                    if (!type) {
                        let arr = url.split('/');
                        if ((method === 'put' || method === 'delete') && arr.length % 2 === 0) {
                            type = arr[arr.length - 2];
                        } else {
                            type = arr[arr.length - 1];
                        }
                    }
                    if (has(type, this.entityAttributes)) {
                        params = assign(params, this.entityAttributes[type]);
                    } else {
                        this.$log.error(`undefined attributes for model: ${type} in api.service`);
                    }
                }
                if (doSerialization) {
                    if (isArray(data)) {
                        return angular.toJson({
                            data: map((item) => serialize(type, params, item, method), data)
                        });
                    } else {
                        return angular.toJson(serialize(type, params, data, method));
                    }
                } else {
                    return angular.toJson(data);
                }
            },
            transformResponse: appendTransform(this.$http.defaults.transformResponse, (data) => {
                if (beforeDeserializationTransform) {
                    data = beforeDeserializationTransform(data);
                }
                if (doDeSerialization) {
                    if (isArray(data)) {
                        return map((item) => deserialize(item, deSerializationOptions), data);
                    } else {
                        return deserialize(data, deSerializationOptions);
                    }
                } else {
                    return data;
                }
            }),
            cacheService: false,
            timeout: 50000
        };

        this.$http(request).then((response) => {
            promise.resolve(response.data);
        }).catch((response) => {
            this.$log.error('API ERROR:', response);
            promise.reject(response);
        });

        return promise.promise;
    }
    get(...params) {
        params = assign(this.handleParamsAsOther(params), { method: 'get' });
        return this.call(params);
    }
    post(...params) {
        params = assign(this.handleParamsAsOther(params), { method: 'post' });
        return this.call(params);
    }
    put(...params) {
        params = assign(this.handleParamsAsOther(params), { method: 'put' });
        return this.call(params);
    }
    delete(...params) {
        params = assign(this.handleParamsAsOther(params), { method: 'delete' });
        return this.call(params);
    }
    handleParamsAsOther(params) {
        if (params.length === 1 && isObject(params[0])) {
            return params[0];
        }
        if (isArray(params)) {
            params = { url: params[0], data: params[1] || {} };
        }
        return params;
    }
    encodeURLarray(array) {
        return map(encodeURIComponent, array);
    }
    cleanFilters(filter) {
        return reduceObject((result, value, key) => {
            if (isArray(value)) {
                value = pull('', value);
                if (value.length > 0) {
                    result[key] = joinComma(value);
                }
            } else if (!isNil(value) && value !== '') {
                result[key] = value;
            }
            return result;
        }, {}, filter);
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
