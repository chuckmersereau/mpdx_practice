import config from 'config';
import japi from 'jsonapi-serializer';
import concat from 'lodash/fp/concat';
import assign from 'lodash/fp/assign';
import has from 'lodash/fp/has';
import isArray from 'lodash/fp/isArray';
import isNil from 'lodash/fp/isNil';
import isObject from 'lodash/fp/isObject';
import map from 'lodash/fp/map';
import pull from 'lodash/fp/pull';
import joinComma from '../fp/joinComma';
import reduceObject from '../fp/reduceObject';

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
    //enable overwrite for put
    if (method === 'put') {
        if (!serialized.data.attributes) {
            serialized.data.attributes = {};
        }
        serialized.data.attributes.overwrite = true;
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
        overrideGetAsPost = false,
        type = null,
        doSerialization = true,
        deSerializationOptions = {},
        doDeSerialization = true,
        beforeDeserializationTransform = null,
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

        if (overrideGetAsPost) {
            headers['X-HTTP-Method-Override'] = 'GET';
            method = 'post';
            doSerialization = false;
            if (!type) {
                let arr = url.split('/');
                data.data = {type: arr[arr.length - 1]};
            } else {
                data.data = {type: type};
            }
            data.filter = this.cleanFilters(data.filter);
        }

        if (method === 'get' || method === 'delete') {
            params = assign(params, data);
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
                if (beforeDeserializationTransform) {
                    data = beforeDeserializationTransform(data);
                }
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
            this.$log.error('API ERROR:', response.status, response.data);
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
            } else {
                if (!isNil(value) && value !== '') {
                    result[key] = value;
                }
            }
            return result;
        }, {}, filter);
    }
}

//This class provides all of the meta information needed to serialize jsonapi data
class EntityAttributes {
    constructor() {
        this.attributes = {
            account_list_invites: {
                attributes: ["accepted_at", "accepted_by_user_id", "account_list_id", "cancelled_by_user_id", "code", "created_at", "invited_by_user_id", "recipient_email", "updated_at"]
            },
            account_lists: {
                attributes: ["creator_id", "created_at", "currency", "home_country", "monthly_goal", "name", "notification_preferences", "settings", "salary_organization", "tester", "total_pledges", "updated_at"],
                notification_preferences: {
                    ref: 'id',
                    attributes: ["actions", "notification_type"],
                    notification_type: { ref: 'id' }
                }
            },
            addresses: {
                attributes: ["city", "country", "end_date", "geo", "historic", "location", "metro_area", "postal_code", "primary_mailing_address", "region", "start_date", "state", "street", "valid_values"]
            },
            appeals: {
                attributes: ["amount", "contacts", "created_at", "currencies", "description", "donations", "end_date", "name", "total_currency", "updated_at"]
            },
            bulk: {
                attributes: ["tag_name"],
                pluralizeType: false
            },
            comments: {
                attributes: ["body", "person"],
                person: { ref: 'id', pluralizeType: false }
            },
            contacts: {
                attributes: ["account_list", "addresses", "church_name", "contacts_referred_by_me", "contact_referrals_to_me", "created_at", "direct_deposit", "donor_accounts", "envelope_greeting",
                    "first_donation_date", "full_name", "greeting",
                    "last_activity", "last_appointment", "last_donation_date", "last_letter", "likely_to_give", "last_phone_call", "last_pre_call", "last_thank", "late_at", "locale", "loser_id",
                    "magazine", "name", "next_ask", "no_appeals", "not_duplicated_with", "notes", "notes_saved_at",
                    "people", "pledge_amount", "pledge_currency", "pledge_frequency", "pledge_received", "pledge_start_date", "pls_id", "prayer_letters_id", "prayer_letters_params", "primary_person",
                    "send_newsletter", "status", "status_valid", "tag_list", "timezone", "tnt_id", "total_donations", "uncompleted_tasks_count", "updated_at", "website", "winner_id"
                ],
                addresses: {
                    ref: 'id',
                    attributes: ["city", "historic", "postal_code", "state", "street", "primary_mailing_address", "metro_area", "valid_values", "_destroy"]
                },
                people: {
                    ref: 'id',
                    attributes: ["email_addresses", "first_name", "last_name", "phone_numbers"],
                    email_addresses: {
                        ref: 'id',
                        attributes: ["email", "primary", "source", "valid_values", "_destroy"]
                    },
                    phone_numbers: {
                        ref: 'id',
                        attributes: ["number", "primary", "source", "valid_values", "_destroy"]
                    }
                },
                primary_person: {
                    ref: 'id'
                },
                donor_accounts: {
                    ref: 'id',
                    attributes: ["account_number", "organization", "_destroy"],
                    organization: {ref: 'id'}
                },
                account_list: { ref: 'id' },
                contacts_referred_by_me: {
                    ref: 'id',
                    attributes: ["account_list", "name", "primary_person_first_name", "primary_person_last_name", "primary_person_email", "primary_person_phone", "notes",
                        "spouse_first_name", "spouse_last_name", "spouse_phone", "spouse_email",
                        "primary_address_city", "primary_address_state", "primary_address_postal_code", "primary_address_street",
                        "name", "created_at"
                    ],
                    account_list: { ref: 'id' }
                },
                contact_referrals_to_me: {
                    ref: 'id',
                    attributes: ['referred_by'],
                    contacts: { ref: 'id' }
                },
                typeForAttribute: (key) => {
                    switch (key) {
                        case 'contacts_referred_by_me':
                        case 'referred_by':
                            return 'contacts';
                        case 'primary_person':
                            return 'people';
                        case 'contact_referrals_to_me':
                            return 'contact_referrals';
                        default:
                            return key;
                    }
                }
            },
            donations: {
                attributes: ["amount", "appeal", "appeal_amount", "channel", "created_at", "designation_account", "donation_date", "donor_account", "motivation", "payment_method", "payment_type", "remote_id", "tendered_currency", "tendered_amount", "currency", "memo", "updated_at"],
                designation_account: { ref: 'id' },
                donor_account: { ref: 'id' },
                appeal: { ref: 'id' }
            },
            google_integrations: {
                attributes: ["account_list", "calendar_integration", "calendar_integrations", "calendar_id", "calendar_name", "email_integration", "contacts_integration"],
                account_list: { ref: 'id' }
            },
            imports: {
                attributes: ["file_headers", "file_headers_mappings", "file_constants", "file_constants_mappings", "sample_contacts", "in_preview", "tag_list", "source_account", "groups", "import_by_group", "in_preview", "override", "source", "source_account_id", "group_tags"],
                sample_contacts: { ref: 'id' },
                source_account: { ref: 'id' },
                typeForAttribute: (key) => {
                    switch (key) {
                        case 'sample_contacts':
                            return 'contacts';
                        case 'source_account':
                            return 'google_accounts';
                        default:
                            return key;
                    }
                }
            },
            impersonation: {
                attributes: ["user", "reason"],
                pluralizeType: false
            },
            merge: {
                attributes: ['account_list_to_merge'],
                typeForAttribute: (key) => {
                    if (key === 'account_list_to_merge') {
                        return 'account_lists';
                    }
                    return key;
                },
                account_list_to_merge: { ref: 'id' },
                pluralizeType: false
            },
            merges: {
                attributes: ["winner_id", "loser_id"]
            },
            notifications: {
                attributes: ["contact_id", "notification_type_id", "event_date", "cleared", "created_at", "updated_at", "donation_id"]
            },
            organization_accounts: {
                attributes: ["organization", "password", "username", "person"],
                organization: {ref: 'id'},
                person: {ref: 'id'}
            },
            organizations: {
                attributes: ['name', "org_help_url", "country"]
            },
            people: {
                attributes: ["first_name", "legal_first_name", "last_name", "birthday_month", "birthday_year", "birthday_day", "anniversary_month", "anniversary_year", "anniversary_day", "title",
                    "suffix", "gender", "marital_status", "preferences", "sign_in_count", "current_sign_in_at", "last_sign_in_at", "current_sign_in_ip", "last_sign_in_ip", "created_at", "updated_at",
                    "master_person_id", "middle_name", "access_token", "profession", "deceased", "subscribed_to_updates", "optout_enewsletter", "occupation", "employer", "not_duplicated_with",
                    "phone_numbers", "email_addresses", "facebook_accounts", "family_relationships", "linkedin_accounts", "twitter_accounts", "websites", "winner_id", "loser_id"],
                email_addresses: {
                    ref: 'id',
                    attributes: ["email", "primary", "remote_id", "location", "historic", "source", "valid_values", "_destroy"]
                },
                facebook_accounts: {
                    ref: 'id',
                    attributes: ["_destroy", "username"]
                },
                family_relationships: {
                    ref: 'id',
                    attributes: ["_destroy", "related_person", "relationship", "created_at"],
                    related_person: { ref: 'id' }
                },
                linkedin_accounts: {
                    ref: 'id',
                    attributes: ["_destroy", "public_url"]
                },
                phone_numbers: {
                    ref: 'id',
                    attributes: ["number", "country_code", "location", "primary", "updated_at", "remote_id", "historic", "source", "valid_values", "_destroy"]
                },
                twitter_accounts: {
                    ref: 'id',
                    attributes: ["_destroy", "screen_name"]
                },
                websites: {
                    ref: 'id',
                    attributes: ["_destroy", "url", "primary"]
                },
                typeForAttribute: (key) => {
                    if (key === 'related_person') {
                        return 'people';
                    }
                    return key;
                }
            },
            resets: {
                attributes: ["resetted_user_email", "reason", "account_list_name"]
            },
            tasks: {
                attributes: ["account_list", "activity_type", "comments", "completed", "completed_at", "created_at", "contacts", "due_date", "end_at", "location",
                    "next_action", "no_date", "notification_id", "notification_time_before", "notification_time_unit", "notification_scheduled", "notification_type",
                    "remote_id", "result", "source", "starred", "start_at", "subject", "tag_list", "type", "updated_at"],
                account_list: { ref: 'id' },
                comments: {
                    ref: 'id',
                    attributes: ["body", "person"],
                    person: { ref: 'id' }
                },
                contacts: { ref: 'id' }
            },
            tags: {
                attributes: ['name']
            },
            user: {
                attributes: ["first_name", "last_name", "preferences", "setup", "email_addresses", "access_token", "time_zone", "locale", "updated_at"],
                email_addresses: {
                    ref: 'id',
                    attributes: ["email"]
                }
            },
            user_options: {
                attributes: ["key", "value"]
            },
            mail_chimp_account: {
                attributes: ["api_key", "primary_list_id", "sync_all_active_contacts", "auto_log_campaigns"]
            }
        };
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
