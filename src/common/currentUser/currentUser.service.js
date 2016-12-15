class CurrentUser {
    api;
    help;

    constructor(
        $log,
        api, help, personalService
    ) {
        this.help = help;
        this.api = api;
        this.$log = $log;
        this.personalService = personalService;

        this.hasAnyUsAccounts = false;
        this.get();
    }
    get() {
        return this.api.get('current_user').then((currentUser) => {
            _.extend(this, currentUser);
            this.personalService.load(); //TODO: handle better in api v2,
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
