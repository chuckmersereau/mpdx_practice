class CurrentUser {
    api;

    constructor(
         $log,
         api, HelpService
    ) {
        this.helpService = HelpService;
        this.api = api;
        this.$log = $log;
        this.hasAnyUsAccounts = false;
        this.get();
    }
    get() {
        return this.api.get('user').then((currentUser) => {
            _.extend(this, currentUser);
            console.log(this.currentUser);
            this.helpService.updateUser(this.currentUser);
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
