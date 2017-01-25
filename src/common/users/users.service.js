class Users {
    accounts;
    api;
    help;
    locale;
    organizationAccounts;

    constructor(
        $log, $q, $rootScope,
        accounts, api, help, locale
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
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
    getCurrent(reset = false) {
        if (this.current && !reset) {
            return this.$q.resolve();
        }
        return this.api.get('user', {include: 'email_addresses'}).then((response) => {
            this.current = response;
            this.$log.debug('current user: ', response);

            if (reset) {
                return this.current;
            }

            const locale = _.get(response, 'preferences.locale', 'en');
            this.locale.change(locale);
            const defaultAccountListId = _.get(response, 'preferences.default_account_list').toString();

            return this.accounts.swap(defaultAccountListId).then(() => {
                this.help.updateUser(this.current);
                return this.accounts.load().then(() => { // force load accounts in resolve
                    return this.current;
                });
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
    destroy(id) {
        return this.api.delete(`users/${id}`);
    }
    saveCurrent() {
        this.$log.debug('user put', this.current);
        return this.api.put('user', this.current).then(() => {
            return this.getCurrent(true).then((data) => { //force relead to reconcile as put response is incomplete
                return data;
            });
        });
    }
}

export default angular.module('mpdx.common.users.service', [])
    .service('users', Users).name;
