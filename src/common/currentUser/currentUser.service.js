class CurrentUser {
    api;
    help;
    personal;

    constructor(
        $log,
        api, help, personal
    ) {
        this.help = help;
        this.api = api;
        this.$log = $log;
        this.personal = personal;

        this.hasAnyUsAccounts = false;
        this.get();
    }
    get() {
        return this.api.get('current_user').then((currentUser) => {
            _.extend(this, currentUser);
            this.personal.load(); //TODO: handle better in api v2,
            this.help.updateUser(this.currentUser);
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
