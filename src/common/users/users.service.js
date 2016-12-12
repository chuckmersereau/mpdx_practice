import config from 'config';

class Users {
    accounts;
    api;
    help;

    constructor(
        $log, $rootScope, gettextCatalog,
        accounts, api, help
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.help = help;

        this.current = null;
        this.hasAnyUsAccounts = false;
    }
    getCurrent() {
        return this.api.get('user').then((response) => {
            this.current = response.data;
            // console.log('current user:', this.current);
            this.api.account_list_id = _.get(response, 'data.attributes.preferences.default_account_list').toString();
            const locale = _.get(response, 'data.attributes.preferences.locale', 'en');
            this.changeLocale(locale);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            this.help.updateUser(this.current);
            return this.accounts.load(); // force load accounts in resolve
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
}

export default angular.module('mpdx.common.users.service', [])
    .service('users', Users).name;
