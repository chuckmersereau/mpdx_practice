class CurrentUser {
    api;

    constructor(api, $log) {
        this.api = api;
        this.$log = $log;

        this.hasAnyUsAccounts = false;

        this.get();
    }
    get() {
        this.api.get('current_user').then((currentUser) => {
            _.extend(this, currentUser.data);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getHasAnyUsAccounts() {
        this.api.get('current_user/has_any_us_accounts').then((response) => {
            this.hasAnyUsAccounts = response.data;
        }).catch(function (err) {
            this.$log.debug(err);
        })
    }
}

export default angular.module('mpdx.services.currentUser', [])
    .service('currentUser', CurrentUser).name;
