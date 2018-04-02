import {
    assign,
    concat,
    defaultTo,
    get,
    has,
    isArray,
    isFunction,
    isNil,
    isObject,
    map,
    omit,
    pull,
    startsWith
} from 'lodash/fp';
import config from 'config';
import { EntityAttributes } from './entities';
import japi from 'jsonapi-serializer';
import joinComma from '../fp/joinComma';
import reduceObject from '../fp/reduceObject';

const jsonApiParams = { keyForAttribute: 'underscore_case' };

class Api {
    constructor(
        $http, $log, $q, $timeout, $window, gettext,
        alerts
    ) {
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.$timeout = $timeout;
        this.$window = $window;
        this.alerts = alerts;
        this.gettext = gettext;

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
        responseType = '',
        autoParams = true,
        errorMessage = null,
        successMessage = null,
        overridePromise = false
    }) {
        ({ headers, method, doSerialization, data } = this.handleOverride(
            overrideGetAsPost, headers, method, doSerialization, type, url, data
        ));

        params = autoParams ? this.assignParams(method, params, data) : params;

        headers = assign(headers, {
            // set jsonapi content type
            'Content-Type': defaultTo('application/vnd.api+json', headers['Content-Type']),
            Accept: defaultTo('application/vnd.api+json', headers.Accept),
            // override the browsers language with the one from current user
            'Accept-Language': this.language
        });

        const request = {
            method: method,
            url: startsWith(this.apiUrl, url) ? url : this.apiUrl + url,
            data: data,
            params: params,
            headers: headers,
            paramSerializer: '$httpParamSerializerJQLike',
            responseType: responseType,
            transformRequest: (data) => this.transformRequest(
                data, url, method, type, overrideGetAsPost, doSerialization
            ),
            transformResponse: this.transformResponse(
                beforeDeserializationTransform, doDeSerialization, deSerializationOptions
            ),
            cacheService: false,
            timeout: 50000
        };

        const deferred = this.$q.defer();
        this.$http(request).then((response) => {
            if (successMessage) {
                this.alerts.addAlert(successMessage);
            }
            deferred.resolve(response.data);
        }).catch((ex) => {
            this.callFailed(ex, request, deferred, errorMessage, overridePromise);
        });
        return deferred.promise;
    }
    callFailed(ex, request, deferred, errorMessage, overridePromise) {
        if (overridePromise) {
            deferred.reject(ex);
        } else {
            errorMessage = this.gettext('An error occurred while contacting the server.');
            return this.alerts.addAlert(errorMessage, 'danger', 0, true).then(() => {
                return this.call(request).then((data) => {
                    deferred.resolve(data);
                });
            }).catch(() => {
                deferred.reject();
            });
        }
        this.$log.error('API ERROR:', ex);
        if (get('track', this.$window._satellite)) {
            this.$window._satellite.track('aa-mpdx-api-error');
        }
    }
    assignParams(method, params, data) {
        return this.isGetOrDelete(method) ? assign(params, data) : params;
    }
    handleOverride(overrideGetAsPost, headers, method, doSerialization, type, url, data) {
        const retVal = {
            headers: headers,
            method: method,
            doSerialization: doSerialization,
            data: data
        };
        return !overrideGetAsPost
            ? retVal
            : assign(retVal, {
                headers: assign(headers, {
                    'X-HTTP-Method-Override': 'GET'
                }),
                method: 'post',
                doSerialization: false,
                data: assign(data, {
                    data: this.getTypeOverride(url, type),
                    filter: this.cleanFilters(data.filter)
                })
            });
    }
    getTypeOverride(url, type) {
        const arr = url.split('/');
        return type
            ? { type: type }
            : { type: arr[arr.length - 1] };
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
            params = {
                url: params[0],
                data: defaultTo({}, params[1]),
                successMessage: defaultTo(null, params[2]),
                errorMessage: defaultTo(null, params[3])
            };
        }
        return params;
    }
    transformRequest(data, url, method, type, overrideGetAsPost, doSerialization) {
        let params = angular.copy(jsonApiParams);
        if (this.isPutPostOrDelete(method, overrideGetAsPost)) {
            type = this.getType(type, url, method);
            params = this.getParams(params, type, doSerialization);
        }
        return doSerialization
            ? this.serializeData(data, type, params, method)
            : angular.toJson(data);
    }
    getType(type, url, method) {
        const arr = url.split('/');
        return defaultTo(
            this.isPutOrDelete(method) && arr.length % 2 === 0
                ? arr[arr.length - 2]
                : arr[arr.length - 1]
            , type);
    }
    getParams(params, type, doSerialization) {
        if (doSerialization && !has(type, this.entityAttributes)) {
            this.$log.error(`undefined attributes for model: ${type} in api.service`);
        }
        return doSerialization ? assign(params, defaultTo({}, this.entityAttributes[type])) : params;
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

import alerts from '../alerts/alerts.service';
import gettext from 'angular-gettext';

export default angular.module('mpdx.common.api', [
    gettext,
    alerts
]).service('api', Api).name;
