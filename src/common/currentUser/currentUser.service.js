class CurrentUser {
    constructor($http, $log) {
        this.$http = $http;
        this.$log = $log;

        this.get();
    }
    get() {
        this.$http.get('api/v1/current_user').then((currentUser) => {
            _.extend(this, currentUser.data);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
}

export default angular.module('mpdxApp.services.currentUser', [])
    .service('currentUser', CurrentUser).name;
