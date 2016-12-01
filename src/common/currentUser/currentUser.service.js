class CurrentUser {
    api;

    constructor(api, $log, helpService) {
        this.helpService = helpService;
        this.api = api;
        this.$log = $log;
        this.hasAnyUsAccounts = false;
        this.get();
    }
    get() {
        return this.api.get('current_user').then((currentUser) => {
            _.extend(this, currentUser);
            console.log(this.currentUser);
            this.helpService.updateUser(this.currentUser);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getHasAnyUsAccounts() {
        this.api.get('current_user/us_accounts').then((response) => {
            this.hasAnyUsAccounts = response;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
}

export default angular.module('mpdx.common.currentUser', [])
    .service('currentUser', CurrentUser).name;
