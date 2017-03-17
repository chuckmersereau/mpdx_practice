import assign from 'lodash/fp/assign';
import get from 'lodash/fp/get';
import has from 'lodash/fp/has';
import keyBy from 'lodash/fp/keyBy';
import keys from 'lodash/fp/keys';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import toString from 'lodash/fp/toString';
import createPatch from "../fp/createPatch";

class Users {
    accounts;
    api;
    help;
    language;
    locale;
    organizationAccounts;

    constructor(
        $log, $q, $rootScope, $state, $window,
        accounts, api, help, language, locale
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$window = $window;
        this.accounts = accounts;
        this.api = api;
        this.help = help;
        this.language = language;
        this.locale = locale;

        this.current = null;
        this.currentInitialState = {};
        this.defaultIncludes = 'account_lists,email_addresses';
        this.defaultFields = {
            user: 'account_lists,email_addresses,first_name,last_name,options,preferences,updated_in_db_at',
            account_lists: 'name',
            email_addresses: 'email,primary,updated_in_db_at'
        };
        this.hasAnyUsAccounts = false;
        this.organizationAccounts = null;

        $rootScope.$on('accountListUpdated', () => {
            this.listOrganizationAccounts();
        });
    }
    getCurrent(reset = false, forRouting = false) {
        if (this.current && !reset) {
            return this.getOptions(reset, forRouting).then(() => {
                return this.current;
            });
        }
        return this.api.get('user', {include: this.defaultIncludes, fields: this.defaultFields}).then((response) => {
            this.current = response;
            this.currentInitialState = angular.copy(this.current);
            this.$log.debug('current user: ', response);

            if (reset) {
                return this.getOptions(reset, forRouting).then(() => {
                    return this.current;
                });
            }

            const localeDisplay = get('preferences.locale_display', response) || 'en-en';
            this.locale.change(localeDisplay);
            const locale = get('preferences.locale', response) || 'en-us';
            this.language.change(locale);

            const defaultAccountList = toString(get('preferences.default_account_list', response));
            const accountListId = this.$window.sessionStorage.getItem(`${this.current.id}_accountListId`) || defaultAccountList;

            return this.accounts.swap(accountListId, this.current.id).then(() => {
                return this.getOptions(true, forRouting).then(() => {
                    this.help.updateUser(this.current);
                    return this.current;
                });
            });
        });
    }
    getOptions(reset = false, forRouting = false) {
        if (this.current.options && !reset) {
            return this.$q.resolve();
        }
        return this.api.get('user/options').then((data) => {
            this.current.options = this.mapOptions(data);
            this.$log.debug('user/options', this.current.options);
            if (forRouting) {
                if (!has('setup_position', this.current.options)) { //force first time setup
                    return this.createOption('setup_position', 'start').then((pos) => {
                        this.current.options.setup_position = pos;
                        //  = this.mapOptions(data);
                        return this.$q.reject({redirect: 'setup.start'});
                    });
                } else if (this.current.options.setup_position.value !== '') {
                    return this.$q.reject({redirect: `setup.${this.current.options.setup_position.value}`});
                }
            }
            return this.current.options;
        });
    }
    mapOptions(options) {
        return keyBy('key', options);
    }
    createOption(key, value) {
        return this.api.post({ url: `user/options`, data: {key: key, value: value}, type: 'user_options' }).then((data) => {
            this.current.options[key] = data;
            return data;
        }); //use jsonapi key here since it doesn't match endpoint
    }
    deleteOption(option) {
        return this.api.delete(`user/options/${option}`);
    }
    getOption(key) {
        return this.api.get(`user/options/${key}`);
    }
    setOption(option) {
        return this.api.put({ url: `user/options/${option.key}`, data: option, type: 'user_options' }).then((data) => {
            this.current.options = reduce((result, val, key) => {
                if (option.key === key) {
                    result[key] = data;
                } else {
                    result[key] = val;
                }
                return result;
            }, {}, this.current.options);
            return data;
        }); //use jsonapi key here since it doesn't match endpoint
    }
    listOrganizationAccounts(reset = false) {
        if (this.organizationAccounts && !reset) {
            return this.$q.resolve(this.organizationAccounts);
        }
        return this.api.get(`user/organization_accounts`, {include: 'organization'}).then((data) => {
            this.$log.debug('user/organization_accounts: ', data);
            this.organizationAccounts = data;
            return data;
        });
    }
    destroy(id) {
        return this.api.delete(`users/${id}`);
    }
    saveCurrent(reset = false) {
        const patch = createPatch(this.currentInitialState, this.current);
        this.$log.debug('user patch', patch);
        if (keys(patch).length < 2) {
            return this.$q.resolve(this.current);
        }
        return this.api.put('user', patch).then((data) => {
            if (reset) {
                return this.getCurrent(true); //force relead to reconcile as put response is incomplete
            }
            this.current = assign({}, this.current, data);
        });
    }
}

export default angular.module('mpdx.common.users.service', [])
    .service('users', Users).name;
