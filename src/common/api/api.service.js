import config from 'config';
import japi from 'jsonapi-serializer';
import clone from 'lodash/fp/clone';
import assign from 'lodash/fp/assign';
import forIn from 'lodash/fp/forIn';
import has from 'lodash/fp/has';
import isArray from 'lodash/fp/isArray';
import isObject from 'lodash/fp/isObject';
import toString from 'lodash/fp/toString';
import map from 'lodash/fp/map';
import escapeComma from "../fp/escapeComma";
import joinComma from "../fp/joinComma";

function appendTransform(defaults, transform) {
    // We can't guarantee that the default transformation is an array
    defaults = isArray(defaults) ? defaults : [defaults];

    // Append the new transformation to the defaults
    return defaults.concat(transform);
}

const jsonApiParams = {keyForAttribute: 'underscore_case'};
function deserialize(data) {
    if (isObject(data) && data.data) {
        return new japi.Deserializer(jsonApiParams).deserialize(data).then((deserializedData) => {
            deserializedData.meta = data.meta || {};
            return deserializedData;
        });
    } else {
        return data;
    }
}

function serialize(key, params, item, method) {
    let serialized = new japi.Serializer(key, params).serialize(item);
    if (method === 'post' && serialized.data.id === 'undefined') {
        delete serialized.data.id;
    }
    return serialized;
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
        this.entityAttributes = new EntityAttributes().attributes;
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
        overrideGetAsPost = false,
        type = null,
        doSerialization = true
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
        const fixFilters = (val, key) => {
            if (isArray(val)) {
                //handles filter values passed as array with comma in the value
                val = joinComma(map(value => escapeComma(toString(value)), val));
            } else {
                val = escapeComma(toString(val));
            }
            data[`filter[${key}]`] = val;
        };
        if (data.filters) {
            forIn(fixFilters, data.filters);
            delete data.filters;
        }

        if (method === 'get' || method === 'delete') {
            params = data;
        }

        if (overrideGetAsPost) {
            headers['X-HTTP-Method-Override'] = 'POST';
        }
        //set jsonapi content type
        headers['Content-Type'] = 'application/vnd.api+json';
        headers['Accept'] = 'application/vnd.api+json';

        const request = {
            method: method,
            url: this.apiUrl + url,
            data: data,
            params: params,
            headers: headers,
            paramSerializer: '$httpParamSerializerJQLike',
            transformRequest: (data) => {
                let params = clone(jsonApiParams);
                if (method === 'put' || method === 'post' || method === 'delete') {
                    if (!type) {
                        let arr = url.split('/');
                        if ((method === 'put' || method === 'delete') && arr.length % 2 === 0) {
                            type = arr[arr.length - 2];
                        } else {
                            type = arr[arr.length - 1];
                        }
                    }
                    if (has(this.entityAttributes, type)) {
                        params = assign(params, this.entityAttributes[type]);
                    } else {
                        this.$log.error(`undefined attributes for model: ${type} in api.service`);
                    }
                }
                if (doSerialization) {
                    if (isArray(data)) {
                        return angular.toJson({
                            data: map(item => serialize(type, params, item, method), data)
                        });
                    } else {
                        return angular.toJson(serialize(type, params, data, method));
                    }
                } else {
                    return angular.toJson(data);
                }
            },
            transformResponse: appendTransform(this.$http.defaults.transformResponse, (data) => {
                if (doSerialization) {
                    if (isArray(data)) {
                        return map(item => deserialize(item), data);
                    } else {
                        return deserialize(data);
                    }
                } else {
                    return data;
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
}

//This class provides all of the meta information needed to serialize jsonapi data
class EntityAttributes {
    constructor() {
        this.attributes = {
            account_list_invites: {
                attributes: ["created_at", "updated_at", "accepted_at", "accepted_by_user_id", "account_list_id", "cancelled_by_user_id", "code", "invited_by_user_id", "recipient_email", "updated_at", "updated_in_db_at"]
            },
            account_lists: {
                attributes: ["creator_id", "created_at", "monthly_goal", "name", "notification_preferences", "settings", "total_pledges", "updated_at", "updated_in_db_at"],
                notification_preferences: {
                    ref: 'id',
                    attributes: ["actions"]
                }
            },
            addresses: {
                attributes: ["street", "city", "country", "end_date", "geo", "historic", "location", "postal_code", "primary_mailing_address", "start_date", "state", "updated_in_db_at"]
            },
            appeals: {
                attributes: ["created_at", "updated_at", "amount", "currencies", "description", "donations", "end_date", "name", "total_currency", "contacts", "updated_in_db_at"]
            },
            comments: {
                attributes: ["body", "updated_in_db_at", "person"],
                person: { ref: 'id', pluralizeType: false }
            },
            contacts: {
                attributes: ["name", "account_list", "created_at", "updated_at", "pledge_amount", "status", "total_donations", "last_donation_date", "first_donation_date", "notes", "notes_saved_at",
                    "full_name", "greeting", "website", "pledge_frequency", "pledge_start_date", "next_ask", "likely_to_give", "church_name", "send_newsletter", "direct_deposit", "magazine", "last_activity",
                    "last_appointment", "last_letter", "last_phone_call", "last_pre_call", "last_thank", "pledge_received", "tnt_id", "not_duplicated_with", "uncompleted_tasks_count", "prayer_letters_id",
                    "timezone", "envelope_greeting", "no_appeals", "prayer_letters_params", "pls_id", "pledge_currency", "locale", "late_at", "people", "addresses", "updated_in_db_at", "winner_id", "loser_id"],
                addresses: { ref: 'id' },
                people: { ref: 'id' },
                account_list: { ref: 'id' }
            },
            donations: {
                attributes: ["remote_id", "donor_account_id", "designation_account_id", "motivation", "payment_method", "tendered_currency", "tendered_amount", "currency", "amount", "memo",
                    "donation_date", "created_at", "updated_at", "payment_type", "channel", "appeal_id", "appeal_amount", "updated_in_db_at"]
            },
            email_addresses: {
                attributes: ["person_id", "email", "primary", "created_at", "updated_at", "remote_id", "location", "historic", "updated_in_db_at"]
            },
            family_relationships: {
                attributes: ["person_id", "related_person_id", "relationship", "created_at", "updated_at", "updated_in_db_at"]
            },
            notifications: {
                attributes: ["contact_id", "notification_type_id", "event_date", "cleared", "created_at", "updated_at", "donation_id", "updated_in_db_at"]
            },
            organization_accounts: {
                attributes: ["organization", "password", "username"],
                organization: {ref: 'id'}
            },
            people: {
                attributes: ["first_name", "legal_first_name", "last_name", "birthday_month", "birthday_year", "birthday_day", "anniversary_month", "anniversary_year", "anniversary_day", "title",
                    "suffix", "gender", "marital_status", "preferences", "sign_in_count", "current_sign_in_at", "last_sign_in_at", "current_sign_in_ip", "last_sign_in_ip", "created_at", "updated_at",
                    "master_person_id", "middle_name", "access_token", "profession", "deceased", "subscribed_to_updates", "optout_enewsletter", "occupation", "employer", "not_duplicated_with",
                    "phone_numbers", "email_addresses", "facebook_accounts", "family_relationships", "linkedin_accounts", "websites", "updated_in_db_at", "winner_id", "loser_id"],
                email_addresses: {
                    ref: 'id',
                    attributes: ["email", "primary", "created_at", "updated_at", "remote_id", "location", "historic", "updated_in_db_at"]
                },
                facebook_accounts: {
                    ref: 'id',
                    attributes: ["remote_id", "token", "token_expires_at", "created_at", "updated_at", "valid_token", "first_name", "last_name", "authenticated", "downloading", "last_download", "username", "updated_in_db_at"]
                },
                family_relationships: {
                    ref: 'id',
                    attributes: ["related_person", "relationship", "created_at", "updated_at", "updated_in_db_at"],
                    related_person: { ref: 'id' }
                },
                linkedin_accounts: {
                    ref: 'id',
                    attributes: ["remote_id", "token", "secret", "token_expires_at", "created_at", "updated_at", "valid_token", "first_name", "last_name", "authenticated", "downloading", "last_download", "public_url", "updated_in_db_at"]
                },
                phone_numbers: {
                    ref: 'id',
                    attributes: ["number", "country_code", "location", "primary", "created_at", "updated_at", "remote_id", "historic", "updated_in_db_at"]
                },
                websites: {
                    ref: 'id',
                    attributes: ["url", "primary", "created_at", "updated_at", "updated_in_db_at"]
                },
                typeForAttribute: (key) => {
                    if (key === 'related_person') {
                        return 'people';
                    }
                    return key;
                }
            },
            person_facebook_accounts: {
                attributes: ["person_id", "remote_id", "token", "token_expires_at", "created_at", "updated_at", "valid_token", "first_name", "last_name", "authenticated", "downloading", "last_download", "username", "updated_in_db_at"]
            },
            person_google_accounts: {
                attributes: ["remote_id", "person_id", "token", "refresh_token", "expires_at", "valid_token", "created_at", "updated_at", "email", "authenticated", "primary", "downloading", "last_download", "last_email_sync", "notified_failure", "updated_in_db_at"]
            },
            person_key_accounts: {
                attributes: ["person_id", "relay_remote_id", "first_name", "last_name", "email", "designation", "employee_id", "username", "authenticated", "created_at", "updated_at", "primary", "downloading", "last_download", "remote_id", "updated_in_db_at"]
            },
            person_linkedin_accounts: {
                attributes: ["person_id", "remote_id", "token", "secret", "token_expires_at", "created_at", "updated_at", "valid_token", "first_name", "last_name", "authenticated", "downloading", "last_download", "public_url", "updated_in_db_at"]
            },
            person_organization_accounts: {
                attributes: ["person_id", "organization_id", "username", "password", "created_at", "updated_at", "remote_id", "authenticated", "valid_credentials", "downloading", "last_download", "token", "locked_at", "disable_downloads", "updated_in_db_at"]
            },
            person_twitter_accounts: {
                attributes: ["person_id", "remote_id", "screen_name", "token", "secret", "created_at", "updated_at", "valid_token", "authenticated", "primary", "downloading", "last_download", "updated_in_db_at"]
            },
            person_websites: {
                attributes: ["person_id", "url", "primary", "created_at", "updated_at", "updated_in_db_at"]
            },
            phone_numbers: {
                attributes: ["person_id", "number", "country_code", "location", "primary", "created_at", "updated_at", "remote_id", "historic", "updated_in_db_at"]
            },
            tasks: {
                attributes: ["account_list", "activity_type", "location", "start_at", "end_at", "type", "created_at", "updated_at", "completed", "completed_at", "comments", "contacts", "due_date",
                    "notification_id", "next_action", "no_date", "notification_type", "notification_time_before", "remote_id", "result", "source", "starred", "subject", "tag_list",
                    "notification_time_unit", "notification_scheduled", "updated_in_db_at"],
                account_list: { ref: 'id' },
                comments: {
                    ref: 'id',
                    attributes: ["body", "updated_in_db_at", "person"],
                    person: { ref: 'id' }
                },
                contacts: { ref: 'id' }
            },
            user: {
                attributes: ["first_name", "last_name", "preferences", "setup", "email_addresses", "access_token", "time_zone", "locale", "updated_at", "updated_in_db_at"],
                email_addresses: { ref: 'id' }
            },
            user_options: {
                attributes: ["key", "value", "updated_in_db_at"]
            }
        };
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
