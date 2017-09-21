import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import config from 'config';
import defaultTo from 'lodash/fp/defaultTo';
import { EntityAttributes } from './entities';
import has from 'lodash/fp/has';
import isArray from 'lodash/fp/isArray';
import isFunction from 'lodash/fp/isFunction';
import isNil from 'lodash/fp/isNil';
import isObject from 'lodash/fp/isObject';
import japi from 'jsonapi-serializer';
import joinComma from '../fp/joinComma';
import map from 'lodash/fp/map';
import omit from 'lodash/fp/omit';
import pull from 'lodash/fp/pull';
import reduceObject from '../fp/reduceObject';

const jsonApiParams = { keyForAttribute: 'underscore_case' };

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
        this.language = 'en-US';
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

        params = this.isGetOrDelete(method) ? assign(params, data) : params;

        // set jsonapi content type
        headers['Content-Type'] = defaultTo('application/vnd.api+json', headers['Content-Type']);
        headers.Accept = defaultTo('application/vnd.api+json', headers.Accept);

        // override the browsers language with the one from current user
        headers['Accept-Language'] = this.language;

        const request = {
            method: method,
            url: this.apiUrl + url,
            data: data,
            params: params,
            headers: headers,
            paramSerializer: '$httpParamSerializerJQLike',
            responseType: responseType,
            transformRequest: (data) => this.transformRequest(data, url, method, type, overrideGetAsPost,
                doSerialization),
            transformResponse: this.transformResponse(beforeDeserializationTransform, doDeSerialization,
                deSerializationOptions),
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
    isGetOrDelete(method) {
        return method === 'get' || method === 'delete';
    }
    isPutOrDelete(method) {
        return method === 'put' || method === 'delete';
    }
    isPutPostOrDelete(method, overrideGetAsPost) {
        return this.isPutOrDelete(method) || (method === 'post' && !overrideGetAsPost);
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
    transformRequest(data, url, method, type, overrideGetAsPost, doSerialization) {
        let params = angular.copy(jsonApiParams);
        if (this.isPutPostOrDelete(method, overrideGetAsPost)) {
            if (!type) {
                let arr = url.split('/');
                if (this.isPutOrDelete(method) && arr.length % 2 === 0) {
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
        return doSerialization
            ? this.serializeData(data, type, params, method)
            : angular.toJson(data);
    }
    serializeData(data, type, params, method) {
        return isArray(data)
            ? angular.toJson({
                data: map((item) => this.serialize(type, params, item, method), data)
            })
            : angular.toJson(this.serialize(type, params, data, method));
    }
    transformResponse(beforeDeserializationTransform, doDeSerialization, deSerializationOptions) {
        return this.appendTransform(this.$http.defaults.transformResponse, (data) =>
            this.afterTransform(data, beforeDeserializationTransform, doDeSerialization, deSerializationOptions));
    }
    afterTransform(data, beforeDeserializationTransform, doDeSerialization, deSerializationOptions) {
        data = this.doBeforeSerialization(beforeDeserializationTransform, data);
        return doDeSerialization ? this.deserializeData(data, deSerializationOptions) : data;
    }
    deserializeData(data, deSerializationOptions) {
        return isArray(data)
            ? map((item) => this.deserialize(item, deSerializationOptions), data)
            : this.deserialize(data, deSerializationOptions);
    }
    doBeforeSerialization(beforeDeserializationTransform, data) {
        return isFunction(beforeDeserializationTransform) ? beforeDeserializationTransform(data) : data;
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
    appendTransform(defaults, transform) {
        // We can't guarantee that the default transformation is an array
        defaults = isArray(defaults) ? defaults : [defaults];

        // Append the new transformation to the defaults
        return concat(defaults, transform);
    }
    deserialize(data, deSerializationOptions) {
        const options = assign(jsonApiParams, deSerializationOptions);
        return this.isDataObject(data)
            ? new japi.Deserializer(options).deserialize(data).then((deserializedData) => {
                deserializedData.meta = defaultTo({}, data.meta);
                return deserializedData;
            })
            : data;
    }
    isDataObject(data) {
        return isObject(data) && data.data;
    }
    removeIdIfUndefined(serialized, method) {
        return method === 'post' && serialized.data.id === 'undefined' ? omit(['data.id'], serialized) : serialized;
    }
    serialize(key, params, item, method) {
        let serialized = new japi.Serializer(key, params).serialize(item);
        serialized = this.removeIdIfUndefined(serialized, method);
        serialized = this.enablePutOverwrite(serialized, method);
        return serialized;
    }
    enablePutOverwrite(serialized, method) {
        if (method === 'put') {
            serialized.data.attributes = defaultTo({}, serialized.data.attributes);
            serialized.data.attributes.overwrite = true;
        }
        return serialized;
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
