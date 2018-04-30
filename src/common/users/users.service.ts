import { defaultTo, find, get, keyBy, keys, toString } from 'lodash/fp';
import createPatch from '../fp/createPatch';
import config from '../../config';

export class UsersService {
    current: any;
    currentInitialState: any;
    currentOptions: any;
    defaultIncludes: string;
    hasAnyUsAccounts: boolean;
    organizationAccounts: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private $window: ng.IWindowService,
        private Rollbar: any,
        private accounts: AccountsService,
        private api: ApiService,
        private help: HelpService,
        private language: LanguageService,
        private locale: LocaleService
    ) {
        this.current = null;
        this.currentInitialState = {};
        this.currentOptions = {};
        this.defaultIncludes = 'account_lists,email_addresses,facebook_accounts,family_relationships,'
              + 'family_relationships.related_person,linkedin_accounts,master_person,'
              + 'phone_numbers,twitter_accounts,websites';
        this.hasAnyUsAccounts = false;
        this.organizationAccounts = [];
    }
    getCurrent(reset = false, forRouting = false) {
        if (this.current && !reset) {
            return this.getOptions(false, forRouting).then(() => {
                return this.current;
            });
        }
        return this.api.get('user', { include: this.defaultIncludes }).then((data) => {
            this.current = data;

            /* istanbul ignore next */
            this.$log.debug('current user: ', this.current);

            this.currentInitialState = angular.copy(this.current);

            this.configureRollbarPerson(this.current);
            this.help.updateUser(this.current);

            if (reset) {
                return this.getOptions(reset, forRouting).then(() => {
                    return this.current;
                });
            }

            const localeDisplay = get('preferences.locale_display', this.current) || 'en-en';
            this.locale.change(localeDisplay);
            const locale = get('preferences.locale', this.current) || 'en-us';
            this.language.change(locale);

            const defaultAccountList = toString(get('preferences.default_account_list', this.current));
            const accountListId = this.$window.localStorage.getItem(`${this.current.id}_accountListId`) || defaultAccountList;

            if (!accountListId) {
                return this.getOptions(true, true).then(() => {
                    return this.redirectUserToStart();
                });
            }

            return this.accounts.swap(accountListId, this.current.id).then(() => {
                return this.getOptions(true, forRouting).then(() => {
                    return this.getKeyAccount().then(() => {
                        return this.current;
                    });
                });
            }).catch(() => {
                if (!get('setup_position', this.currentOptions)) {
                    return this.redirectUserToStart();
                } else {
                    return this.$q.reject('');
                }
            });
        });
    }
    redirectUserToStart() {
        return this.setOption({ key: 'setup_position', value: 'start' }).then(() => {
            this.$window.localStorage.removeItem(`${this.current.id}_accountListId`);
            return this.$q.reject({ redirect: 'setup.start' });
        });
    }
    configureRollbarPerson(data) {
        if (!config.rollbarAccessToken) {
            return;
        }
        const primaryEmail = find({ primary: true }, data.email_addresses) as any;
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
            /* istanbul ignore next */
            this.$log.debug('user/options', this.currentOptions);
            if (forRouting) {
                if (!get('setup_position', this.currentOptions)) { // force first time setup
                    return this.createOption('setup_position', 'start').then((pos) => {
                        this.currentOptions.setup_position = pos;
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
    getCurrentOptionValue(key) {
        return get('value', get(key, this.currentOptions));
    }
    deleteOption(option) {
        return this.api.delete({
            url: `user/options/${option}`,
            type: 'user_options'
        }).then(() => {
            delete this.currentOptions[option];
        });
    }
    getOption(key) {
        return this.api.get(`user/options/${key}`);
    }
    setOption(option) {
        return this.api.put({ url: `user/options/${option.key}`, data: option, type: 'user_options' }).then((data) => {
            if (option && option.key) {
                this.currentOptions[option.key] = data;
            }
            return data;
        }); // use jsonapi key here since it doesn't match endpoint
    }
    listOrganizationAccounts(reset = false) {
        if (this.organizationAccounts.length > 0 && !reset) {
            return this.$q.resolve(this.organizationAccounts);
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
    saveCurrent(successMessage?) {
        const patch = createPatch(this.currentInitialState, this.current);
        this.$log.debug('user patch', patch);
        if (keys(patch).length < 2) {
            return this.$q.resolve(this.current);
        }
        return this.api.put('user', patch, successMessage).then(() => {
            return this.getCurrent(true); // force reload to reconcile as put response is incomplete
        });
    }
    getKeyAccount() {
        return this.api.get('user/key_accounts').then((data) => {
            if (get('remote_id', data[0])) {
                this.current.key_uuid = data[0].remote_id;
            }
        });
    }
}

import accounts, { AccountsService } from '../accounts/accounts.service';
import help, { HelpService } from '../help/help.service';
import language, { LanguageService } from '../language/language.service';
import locale, { LocaleService } from '../locale/locale.service';
import uiRouter from '@uirouter/angularjs';
import { ApiService } from '../api/api.service';
import { StateService } from '@uirouter/core';

export default angular.module('mpdx.common.users.service', [
    'tandibar/ng-rollbar',
    uiRouter,
    accounts, help, language, locale
]).service('users', UsersService).name;
