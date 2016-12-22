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
        this.entityAttributes = new EntityAttributes().attributes;

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
                if (method === 'put' || method === 'post') {
                    let arr = url.split('/');
                    if (method === 'put' && arr.length % 2 === 0) {
                        key = arr[arr.length - 2];
                    } else {
                        key = arr[arr.length - 1];
                    }
                    if (_.has(this.entityAttributes, key)) {
                        _.extend(params, this.entityAttributes[key]);
                    } else {
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

//This class provides all of the meta information needed to serialize jsonapi data
class EntityAttributes {
    constructor() {
        this.attributes = {
            account_list_invites: {
                attributes: ["created_at", "updated_at", "accepted_at", "accepted_by_user_id", "account_list_id", "cancelled_by_user_id", "code", "invited_by_user_id", "recipient_email"]
            },
            account_lists: {
                attributes: ["name", "creator_id", "created_at", "updated_at", "settings"]
            },
            addresses: {
                attributes: ["street", "city", "country", "end_date", "geo", "historic", "location", "postal_code", "primary_mailing_address", "start_date", "state"]
            },
            appeals: {
                attributes: ["created_at", "updated_at", "amount", "currencies", "description", "donations", "end_date", "name", "total_currency", "contacts"]
            },
            contacts: {
                attributes: ["name", "account_list_id", "created_at", "updated_at", "pledge_amount", "status", "total_donations", "last_donation_date", "first_donation_date", "notes", "notes_saved_at",
                    "full_name", "greeting", "website", "pledge_frequency", "pledge_start_date", "next_ask", "likely_to_give", "church_name", "send_newsletter", "direct_deposit", "magazine", "last_activity",
                    "last_appointment", "last_letter", "last_phone_call", "last_pre_call", "last_thank", "pledge_received", "tnt_id", "not_duplicated_with", "uncompleted_tasks_count", "prayer_letters_id",
                    "timezone", "envelope_greeting", "no_appeals", "prayer_letters_params", "pls_id", "pledge_currency", "locale", "late_at", "people", "addresses"],
                addresses: () => _.extend({ ref: 'id' }, this.attributes.addresses),
                people: () => _.extend({ ref: 'id' }, this.attributes.people)
            },
            donations: {
                attributes: ["remote_id", "donor_account_id", "designation_account_id", "motivation", "payment_method", "tendered_currency", "tendered_amount", "currency", "amount", "memo",
                    "donation_date", "created_at", "updated_at", "payment_type", "channel", "appeal_id", "appeal_amount"]
            },
            email_addresses: {
                attributes: ["person_id", "email", "primary", "created_at", "updated_at", "remote_id", "location", "historic", "email"]
            },
            family_relationships: {
                attributes: ["person_id", "related_person_id", "relationship", "created_at", "updated_at"]
            },
            notifications: {
                attributes: ["contact_id", "notification_type_id", "event_date", "cleared", "created_at", "updated_at", "donation_id"]
            },
            people: {
                attributes: ["first_name", "legal_first_name", "last_name", "birthday_month", "birthday_year", "birthday_day", "anniversary_month", "anniversary_year", "anniversary_day", "title",
                    "suffix", "gender", "marital_status", "preferences", "sign_in_count", "current_sign_in_at", "last_sign_in_at", "current_sign_in_ip", "last_sign_in_ip", "created_at", "updated_at",
                    "master_person_id", "middle_name", "access_token", "profession", "deceased", "subscribed_to_updates", "optout_enewsletter", "occupation", "employer", "not_duplicated_with",
                    "phone_numbers", "email_addresses", "facebook_accounts", "family_relationships", "linkedin_accounts", "websites"],
                email_addresses: () => _.extend({ ref: 'id' }, this.attributes.email_addresses),
                facebook_accounts: () => _.extend({ ref: 'id' }, this.attributes.person_facebook_accounts),
                family_relationships: () => _.extend({ ref: 'id' }, this.attributes.family_relationships),
                linkedin_accounts: () => _.extend({ ref: 'id' }, this.attributes.person_linkedin_accounts),
                phone_numbers: () => _.extend({ ref: 'id' }, this.attributes.phone_numbers),
                websites: () => _.extend({ ref: 'id' }, this.attributes.person_websites)
            },
            person_facebook_accounts: {
                attributes: ["person_id", "remote_id", "token", "token_expires_at", "created_at", "updated_at", "valid_token", "first_name", "last_name", "authenticated", "downloading", "last_download", "username"]
            },
            person_google_accounts: {
                attributes: ["remote_id", "person_id", "token", "refresh_token", "expires_at", "valid_token", "created_at", "updated_at", "email", "authenticated", "primary", "downloading", "last_download", "last_email_sync", "notified_failure"]
            },
            person_key_accounts: {
                attributes: ["person_id", "relay_remote_id", "first_name", "last_name", "email", "designation", "employee_id", "username", "authenticated", "created_at", "updated_at", "primary", "downloading", "last_download", "remote_id"]
            },
            person_linkedin_accounts: {
                attributes: ["person_id", "remote_id", "token", "secret", "token_expires_at", "created_at", "updated_at", "valid_token", "first_name", "last_name", "authenticated", "downloading", "last_download", "public_url"]
            },
            person_organization_accounts: {
                attributes: ["person_id", "organization_id", "username", "password", "created_at", "updated_at", "remote_id", "authenticated", "valid_credentials", "downloading", "last_download", "token", "locked_at", "disable_downloads"]
            },
            person_twitter_accounts: {
                attributes: ["person_id", "remote_id", "screen_name", "token", "secret", "created_at", "updated_at", "valid_token", "authenticated", "primary", "downloading", "last_download"]
            },
            person_websites: {
                attributes: ["person_id", "url", "primary", "created_at", "updated_at"]
            },
            phone_numbers: {
                attributes: ["person_id", "number", "country_code", "location", "primary", "created_at", "updated_at", "remote_id", "historic"]
            },
            tasks: {
                attributes: ["account_list_id", "starred", "location", "subject", "start_at", "end_at", "type", "created_at", "updated_at", "completed", "activity_comments_count", "activity_type", "result",
                    "completed_at", "notification_id", "remote_id", "source", "next_action", "no_date", "notification_type", "notification_time_before", "notification_time_unit", "notification_scheduled"]
            },
            users: {
                attributes: ["first_name", "preferences", "setup", "email", "access_token", "time_zone", "locale"]
            }
        };
    }
}

export default angular.module('mpdx.common.api', [])
    .service('api', Api).name;
