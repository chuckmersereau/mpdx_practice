import assign from 'lodash/fp/assign';

class Users {
    accounts;
    api;
    help;
    language;
    locale;
    organizationAccounts;

    constructor(
        $log, $q, $rootScope, $state,
        accounts, api, help, language, locale
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.accounts = accounts;
        this.api = api;
        this.help = help;
        this.language = language;
        this.locale = locale;

        this.current = null;
        this.defaultIncludes = 'email_addresses';
        this.hasAnyUsAccounts = false;
        this.organizationAccounts = null;

        $rootScope.$on('accountListUpdated', () => {
            this.listOrganizationAccounts();
        });
    }
    getCurrent(reset = false, forRouting = false) {
        if (this.current && !reset) {
            return this.$q.resolve();
        }
        return this.api.get('user', {include: this.defaultIncludes}).then((response) => {
            this.current = response;
            this.$log.debug('current user: ', response);

            if (reset) {
                return this.getOptions(reset, forRouting).then(() => {
                    return this.current;
                });
            }

            const localeDisplay = _.get(response, 'preferences.locale_display', 'en-en');
            this.locale.change(localeDisplay);
            const locale = _.get(response, 'preferences.locale', 'en-us');
            this.language.change(locale);

            const defaultAccountListId = _.get(response, 'preferences.default_account_list').toString();

            const promises = [
                this.accounts.swap(defaultAccountListId),
                this.accounts.load() // force load accounts in resolve
            ];
            return this.$q.all(promises).then(() => {
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
                if (!_.has(this.current.options, 'setup_position')) { //force first time setup
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
        return _.keyBy(options, 'key');
    }
    createOption(key, value) {
        return this.api.post({ url: `user/options`, data: {key: key, value: value}, type: 'user_options' }); //use jsonapi key here since it doesn't match endpoint
    }
    deleteOption(option) {
        return this.api.delete(`user/options/${option}`);
    }
    getOption(key) {
        return this.api.get(`user/options/${key}`);
    }
    setOption(option) {
        return this.api.put({ url: `user/options/${option.key}`, data: option, type: 'user_options' }).then((data) => {
            option.updated_in_db_at = data.updated_in_db_at;
        }); //use jsonapi key here since it doesn't match endpoint
    }
    listOrganizationAccounts() {
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
        this.$log.debug('user put', this.current);
        return this.api.put('user', assign({}, this.current, { include: this.defaultIncludes })).then((data) => {
            if (reset) {
                return this.getCurrent(true); //force relead to reconcile as put response is incomplete
            }
            this.current = assign({}, this.current, data);
        });
    }
}

export default angular.module('mpdx.common.users.service', [])
    .service('users', Users).name;
