import config from 'config';

class CurrentUser {
    api;
    helpService;
    personalService;

    constructor(
         $log, $rootScope, gettextCatalog,
         accountsService, api, helpService, personalService
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accountsService = accountsService;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.helpService = helpService;
        this.personalService = personalService;

        this.hasAnyUsAccounts = false;
    }
    get() {
        return this.api.get('user').then((response) => {
            _.extend(this, response.data);
            console.log('current user:', this);
            this.api.account_list_id = _.get(response, 'data.attributes.preferences.default_account_list').toString();
            const locale = _.get(response, 'data.attributes.preferences.locale', 'en');
            this.changeLocale(locale);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            this.helpService.updateUser(this);
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
}

export default angular.module('mpdx.common.currentUser', [])
    .service('currentUser', CurrentUser).name;
