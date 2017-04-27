import config from 'config';

class GoogleController {
    constructor(
        $log, $window,
        api
    ) {
        this.$log = $log;
        this.$window = $window;
        this.api = api;

        this.data = null;
    }
    $onInit() {
        this.api.get(`user/google_accounts`).then((data) => {
            this.$log.debug('user/google_accounts', data);
            this.data = data;
        });
        this.googleOauth = `${config.oAuthUrl}prayer_letters?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.location.href}&access_token=${this.$window.localStorage.getItem('token')}`;
    }
    disconnect(id) {
        return this.api.delete(`user/google_accounts/${id}`);
    }
}

const Google = {
    template: require('./google.html'),
    controller: GoogleController
};

export default angular.module('mpdx.preferences.integrations.google.component', [])
    .component('googleIntegrationPreferences', Google).name;

