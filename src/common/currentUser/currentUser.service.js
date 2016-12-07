class CurrentUser {
    api;
    helpService;

    constructor(
         $log,
         api, helpService
    ) {
        this.helpService = helpService;
        this.api = api;
        this.$log = $log;
        this.hasAnyUsAccounts = false;
        this.get();
    }
    get() {
        return this.api.get('user').then((response) => {
            console.log(response.data);
            _.extend(this, response.data);
            this.api.account_list_id = _.get(this, 'attributes.preferences.default_account_list');
            console.log('api.account_list_id:', this.api.account_list_id);
            this.helpService.updateUser(this);
            return response;
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
