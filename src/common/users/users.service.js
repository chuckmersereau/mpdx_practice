import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import get from 'lodash/fp/get';
import has from 'lodash/fp/has';
import keyBy from 'lodash/fp/keyBy';
import keys from 'lodash/fp/keys';
import toString from 'lodash/fp/toString';
import createPatch from '../fp/createPatch';
import config from 'config';

class Users {
    constructor(
        $log, $q, $rootScope, $state, $window, Rollbar,
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
        this.Rollbar = Rollbar;

        this.current = null;
        this.currentInitialState = {};
        this.currentOptions = null;
        this.defaultIncludes = 'account_lists,email_addresses';
        this.defaultFields = {
            user: 'account_lists,email_addresses,first_name,last_name,options,preferences',
            account_lists: 'name',
            email_addresses: 'email,primary'
        };
        this.hasAnyUsAccounts = false;
        this.organizationAccounts = [];
    }
    getCurrent(reset = false, forRouting = false) {
        if (this.current && !reset) {
            return this.getOptions(reset, forRouting).then(() => {
                return this.current;
            });
        }
        return this.api.get('user', { include: this.defaultIncludes, fields: this.defaultFields }).then((response) => {
            this.current = response;
            this.currentInitialState = angular.copy(this.current);
            this.$log.debug('current user: ', response);

            this.configureRollbarPerson(response);
            this.help.updateUser(this.current);

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
            const accountListId = this.$window.localStorage.getItem(`${this.current.id}_accountListId`) || defaultAccountList;

            if (!accountListId) {
                return this.$q.reject({ redirect: 'setup.account' });
            }

            return this.accounts.swap(accountListId, this.current.id).then(() => {
                return this.getOptions(true, forRouting).then(() => {
                    return this.getKeyAccount().then(() => {
                        return this.current;
                    });
                });
            });
        });
    }
    configureRollbarPerson(data) {
        if (!config.rollbarAccessToken) {
            return;
        }
        const primaryEmail = find({ primary: true }, data.email_addresses);
        const firstEmail = get('email_addresses[0]', data);
        const email = defaultTo(defaultTo('', firstEmail.email), primaryEmail.email);
        this.Rollbar.configure({
            payload: {
                person: {
                    id: data.id,
                    email: email,
                    username: `${data.first_name} ${data.last_name}`
                }
            }
        });
    }
    getOptions(reset = false, forRouting = false) {
        if (this.currentOptions && !reset) {
            return this.$q.resolve();
        }
        return this.api.get('user/options').then((data) => {
            this.currentOptions = this.mapOptions(data);
            this.$log.debug('user/options', this.currentOptions);
            if (forRouting) {
                if (!has('setup_position', this.currentOptions)) { // force first time setup
                    return this.createOption('setup_position', 'start').then((pos) => {
                        this.currentOptions.setup_position = pos;
                        //  = this.mapOptions(data);
                        return this.$q.reject({ redirect: 'setup.start' });
                    });
                } else if (this.currentOptions.setup_position.value !== '') {
                    return this.$q.reject({ redirect: `setup.${this.currentOptions.setup_position.value}` });
                }
            }
            return this.currentOptions;
        });
    }
    mapOptions(options) {
        return keyBy('key', options);
    }
    createOption(key, value) {
        return this.api.post({ url: 'user/options', data: { key: key, value: value }, type: 'user_options' }).then((data) => {
            this.currentOptions[key] = data;
            return data;
        }); // use jsonapi key here since it doesn't match endpoint
    }
    deleteOption(option) {
        return this.api.delete(`user/options/${option}`);
    }
    getOption(key) {
        return this.api.get(`user/options/${key}`);
    }
    setOption(option) {
        return this.api.put({ url: `user/options/${option.key}`, data: option, type: 'user_options' }).then((data) => {
            this.currentOptions[option.key] = data;
            return data;
        }); // use jsonapi key here since it doesn't match endpoint
    }
    listOrganizationAccounts(reset = false) {
        if (this.organizationAccounts.length > 0 && !reset) {
            return Promise.resolve(this.organizationAccounts);
        }
        return this.api.get('user/organization_accounts', { include: 'organization' }).then((data) => {
            this.$log.debug('user/organization_accounts: ', data);
            this.organizationAccounts = data;
            return data;
        });
    }
    destroy(id) {
        return this.api.delete(`users/${id}`);
    }
    saveCurrent() {
        const patch = createPatch(this.currentInitialState, this.current);
        this.$log.debug('user patch', patch);
        if (keys(patch).length < 2) {
            return this.$q.resolve(this.current);
        }
        return this.api.put('user', patch).then(() => {
            return this.getCurrent(true); // force reload to reconcile as put response is incomplete
        });
    }
    getKeyAccount() {
        return this.api.get('user/key_accounts').then((data) => {
            this.current.key_uuid = data[0].remote_id;
        });
    }
}

import accounts from '../accounts/accounts.service';
import help from '../help/help.service';
import language from '../language/language.service';
import locale from '../locale/locale.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.common.users.service', [
    'tandibar/ng-rollbar',
    uiRouter,
    accounts, help, language, locale
]).service('users', Users).name;
