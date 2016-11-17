/*global HS*/
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
            _.extend(this, currentUser);
            HS.beacon.ready(function() {
                HS.beacon.identify({
                    id: currentUser.id,
                    name: `${currentUser.first_name} ${currentUser.last_name}`
                });
            });
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
