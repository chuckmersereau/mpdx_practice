class CurrentUser {
    api;
    helpService;

    constructor(
         $log, $rootScope,
         api, helpService
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.helpService = helpService;

        this.hasAnyUsAccounts = false;
    }
    get() {
        return this.api.get('user').then((response) => {
            _.extend(this, response.data);
            console.log(this);
            this.api.account_list_id = _.get(response, 'data.attributes.preferences.default_account_list').toString();
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            this.helpService.updateUser(this);
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
}

export default angular.module('mpdx.common.currentUser', [])
    .service('currentUser', CurrentUser).name;
