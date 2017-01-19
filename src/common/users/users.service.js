import config from 'config';

class Users {
    accounts;
    api;
    help;
    organizationAccounts;

    constructor(
        $log, $q, $rootScope, gettextCatalog,
        accounts, api, help
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.help = help;

        this.current = null;
        this.hasAnyUsAccounts = false;
        this.organizationAccounts = null;

        $rootScope.$on('accountListUpdated', () => {
            this.listOrganizationAccounts();
        });
    }
    getCurrent(reset = false) {
        if (this.current && !reset) {
            return this.$q.resolve();
        }
        return this.api.get('user', {include: 'email_addresses'}).then((response) => {
            this.current = response;
            this.$log.debug('current user: ', response);
            const locale = _.get(response, 'preferences.locale', 'en');
            this.changeLocale(locale);
            const defaultAccountListId = _.get(response, 'preferences.default_account_list').toString();
            this.accounts.load();
            return this.accounts.swap(defaultAccountListId).then(() => {
                this.help.updateUser(this.current);
                return this.accounts.load(); // force load accounts in resolve
            });
        });
    }
    listOrganizationAccounts() {
        return this.api.get(`user/organization_accounts`).then((data) => {
            this.$log.debug('user/organization_accounts: ', data);
            this.organizationAccounts = data;
            return data;
        });
    }
    changeLocale(locale) {
        this.gettextCatalog.setCurrentLanguage(locale);
        if (config.env !== 'development' && locale !== 'en') {
            this.gettextCatalog.loadRemote('locale/' + locale + '-' + process.env.TRAVIS_COMMIT + '.json');
        }
    }
    destroy(id) {
        return this.api.delete(`users/${id}`);
    }
    save(user) {
        this.$log.debug('user put', user);
        return this.api.put('user', user);
    }
}

export default angular.module('mpdx.common.users.service', [])
    .service('users', Users).name;
