import config from 'config';

class Users {
    accountsService;
    api;
    currentAccountList;
    helpService;

    constructor(
        $log, $rootScope, gettextCatalog,
        accountsService, api, helpService
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accountsService = accountsService;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.helpService = helpService;

        this.current = null;
        this.currentAccountList = null;
        this.hasAnyUsAccounts = false;
    }
    getCurrent() {
        return this.api.get('user').then((response) => {
            this.current = response.data;
            console.log('current user:', this.current);
            this.api.account_list_id = _.get(response, 'data.attributes.preferences.default_account_list').toString();
            const locale = _.get(response, 'data.attributes.preferences.locale', 'en');
            this.changeLocale(locale);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            this.helpService.updateUser(this.current);
            return this.accountsService.load(); // force load accounts in resolve
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getHasAnyUsAccounts() {
        console.error('common/currentUser: endpoint not yet defined');
        // this.api.get('user/us_accounts').then((response) => {
        //     this.hasAnyUsAccounts = response;
        // }).catch((err) => {
        //     this.$log.debug(err);
        // });
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
    listForCurrentAccount() {
        this.api.get(`account_lists/${this.api.account_list_id}/users`).then((data) => {
            this.currentAccountList = data.data;
            console.log('currentAccountList', this.currentAccountList);
            this.loading = false;
        });
    }
}

export default angular.module('mpdx.common.users.service', [])
    .service('users', Users).name;
