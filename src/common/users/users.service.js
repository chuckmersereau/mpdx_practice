class Users {
    accounts;
    api;
    help;
    locale;
    organizationAccounts;

    constructor(
        $log, $q, $rootScope, $state,
        accounts, api, help, locale
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.accounts = accounts;
        this.api = api;
        this.help = help;
        this.locale = locale;

        this.current = null;
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
        return this.api.get('user', {include: 'email_addresses'}).then((response) => {
            this.current = response;
            this.$log.debug('current user: ', response);

            if (reset) {
                return this.getOptions(reset, forRouting).then(() => {
                    return this.current;
                });
            }

            const locale = _.get(response, 'preferences.locale', 'en');
            this.locale.change(locale);
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
                    return this.createOption('setup_position', 'start').then(() => {
                        data.setup_position = {};
                        this.current.options = this.mapOptions(data);
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
        return this.api.get(`user/organization_accounts`).then((data) => {
            this.$log.debug('user/organization_accounts: ', data);
            this.organizationAccounts = data;
            return data;
        });
    }
    destroy(id) {
        return this.api.delete(`users/${id}`);
    }
    saveCurrent() {
        this.$log.debug('user put', this.current);
        return this.api.put('user', this.current).then(() => {
            return this.getCurrent(true); //force relead to reconcile as put response is incomplete
        });
    }
}

export default angular.module('mpdx.common.users.service', [])
    .service('users', Users).name;
