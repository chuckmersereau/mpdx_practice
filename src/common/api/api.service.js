import config from 'config';
import japi from 'jsonapi-serializer';
import concat from 'lodash/fp/concat';
import assign from 'lodash/fp/assign';
import forIn from 'lodash/forIn'; //fp forin not calculating val currently
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
    return concat(defaults, transform);
}

const jsonApiParams = {keyForAttribute: 'underscore_case'};
function deserialize(data, deSerializationOptions) {
    const options = assign(jsonApiParams, deSerializationOptions);
    if (isObject(data) && data.data) {
        return new japi.Deserializer(options).deserialize(data).then((deserializedData) => {
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
        params = {},
        headers = {},
        promise = null,
        attempts = 0,
        overrideGetAsPost = false,
        type = null,
        doSerialization = true,
        deSerializationOptions = {},
        doDeSerialization = true,
        responseType = ''
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
            forIn(data.filters, fixFilters);
            delete data.filters;
        }

        if (method === 'get' || method === 'delete') {
            params = data;
        }
        if ((method === 'put' || method === 'put') && data.include) {
            params.include = data.include;
        }

        if (overrideGetAsPost) {
            headers['X-HTTP-Method-Override'] = 'POST';
        }
        //set jsonapi content type
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
                if (method === 'put' || method === 'post' || method === 'delete') {
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
                if (doDeSerialization) {
                    if (isArray(data)) {
                        return map(item => deserialize(item, deSerializationOptions), data);
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
                attributes: ["accepted_at", "accepted_by_user_id", "account_list_id", "cancelled_by_user_id", "code", "created_at", "invited_by_user_id", "recipient_email", "updated_at", "updated_in_db_at"]
            },
            account_lists: {
                attributes: ["creator_id", "created_at", "monthly_goal", "name", "notification_preferences", "settings", "total_pledges", "updated_at", "updated_in_db_at"],
                notification_preferences: {
                    ref: 'id',
                    attributes: ["actions"]
                }
            },
            addresses: {
                attributes: ["city", "country", "end_date", "geo", "historic", "location", "postal_code", "primary_mailing_address", "start_date", "state", "street", "updated_in_db_at"]
            },
            appeals: {
                attributes: ["amount", "contacts", "created_at", "currencies", "description", "donations", "end_date", "name", "total_currency", "updated_at", "updated_in_db_at"]
            },
            bulk: {
                attributes: ["tag_name"],
                pluralizeType: false
            },
            comments: {
                attributes: ["body", "person", "updated_in_db_at"],
                person: { ref: 'id', pluralizeType: false }
            },
            contacts: {
                attributes: ["account_list", "addresses", "church_name", "contacts_referred_by_me", "contacts_that_referred_me", "created_at", "direct_deposit", "donor_accounts", "envelope_greeting",
                    "first_donation_date", "full_name", "greeting",
                    "last_activity", "last_appointment", "last_donation_date", "last_letter", "likely_to_give", "last_phone_call", "last_pre_call", "last_thank", "late_at", "locale", "loser_id",
                    "magazine", "name", "next_ask", "no_appeals", "not_duplicated_with", "notes", "notes_saved_at",
                    "people", "pledge_amount", "pledge_currency", "pledge_frequency", "pledge_received", "pledge_start_date", "pls_id", "prayer_letters_id", "prayer_letters_params",
                    "send_newsletter", "status", "tag_list", "timezone", "tnt_id", "total_donations", "uncompleted_tasks_count", "updated_at", "updated_in_db_at", "website", "winner_id"
                ],
                addresses: {
                    ref: 'id',
                    attributes: ["city", "postal_code", "state", "street"]
                },
                people: {
                    ref: 'id',
                    attributes: ["email_addresses", "first_name", "last_name", "phone_numbers"],
                    email_addresses: {
                        ref: 'id',
                        attributes: ["email", "primary"]
                    },
                    phone_numbers: {
                        ref: 'id',
                        attributes: ["number", "primary"]
                    }
                },
                donor_accounts: {
                    ref: 'id',
                    attributes: ["account_number", "organization"],
                    organization: {ref: 'id'}
                },
                account_list: { ref: 'id' },
                contacts_referred_by_me: {
                    ref: 'id',
                    attributes: ["name", "primary_person_first_name", "primary_person_last_name", "primary_person_email", "primary_person_phone",
                        "spouse_first_name", "spouse_last_name", "spouse_phone", "spouse_email",
                        "primary_address_city", "primary_address_state", "primary_address_postal_code", "primary_address_street"
                    ]},
                contacts_that_referred_me: { ref: 'id' },
                typeForAttribute: (key) => {
                    if (key === 'contacts_referred_by_me' || key === 'contacts_that_referred_me') {
                        return 'contacts';
                    }
                    return key;
                }

            },
            donations: {
                attributes: ["amount", "appeal", "appeal_amount", "channel", "created_at", "designation_account", "donation_date", "donor_account", "motivation", "payment_method", "payment_type", "remote_id", "tendered_currency", "tendered_amount", "currency", "memo", "updated_at", "updated_in_db_at"],
                designation_account: { ref: 'id' },
                donor_account: { ref: 'id' },
                appeal: { ref: 'id' }
            },
            merges: {
                attributes: ["winner_id", "loser_id"]
            },
            notifications: {
                attributes: ["contact_id", "notification_type_id", "event_date", "cleared", "created_at", "updated_at", "donation_id", "updated_in_db_at"]
            },
            organization_accounts: {
                attributes: ["organization", "password", "username", "person"],
                organization: {ref: 'id'},
                person: {ref: 'id'}
            },
            people: {
                attributes: ["first_name", "legal_first_name", "last_name", "birthday_month", "birthday_year", "birthday_day", "anniversary_month", "anniversary_year", "anniversary_day", "title",
                    "suffix", "gender", "marital_status", "preferences", "sign_in_count", "current_sign_in_at", "last_sign_in_at", "current_sign_in_ip", "last_sign_in_ip", "created_at", "updated_at",
                    "master_person_id", "middle_name", "access_token", "profession", "deceased", "subscribed_to_updates", "optout_enewsletter", "occupation", "employer", "not_duplicated_with",
                    "phone_numbers", "email_addresses", "facebook_accounts", "family_relationships", "linkedin_accounts", "twitter_accounts", "websites", "updated_in_db_at", "winner_id", "loser_id"],
                email_addresses: {
                    ref: 'id',
                    attributes: ["email", "primary", "remote_id", "location", "historic", "updated_in_db_at"]
                },
                facebook_accounts: {
                    ref: 'id',
                    attributes: ["username", "updated_in_db_at"]
                },
                family_relationships: {
                    ref: 'id',
                    attributes: ["related_person", "relationship", "created_at", "updated_in_db_at"],
                    related_person: { ref: 'id' }
                },
                linkedin_accounts: {
                    ref: 'id',
                    attributes: ["public_url", "updated_in_db_at"]
                },
                phone_numbers: {
                    ref: 'id',
                    attributes: ["number", "country_code", "location", "primary", "updated_at", "remote_id", "historic", "updated_in_db_at"]
                },
                twitter_accounts: {
                    ref: 'id',
                    attributes: ["screen_name", "updated_in_db_at"]
                },
                websites: {
                    ref: 'id',
                    attributes: ["url", "primary", "updated_in_db_at"]
                },
                typeForAttribute: (key) => {
                    if (key === 'related_person') {
                        return 'people';
                    }
                    return key;
                }
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
            tags: {
                attributes: ['name']
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
