class CurrentUser {
    constructor(api, $log) {
        this.api = api;
        this.$log = $log;

        this.get();
    }
    get() {
        this.api.get('current_user').then((currentUser) => {
            _.extend(this, currentUser.data);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
}

export default angular.module('mpdxApp.services.currentUser', [])
    .service('currentUser', CurrentUser).name;
