import config from 'config';

class GoogleController {
    constructor(
        $log, $window, gettextCatalog,
        alerts, api, modal
    ) {
        this.$log = $log;
        this.$window = $window;
        this.alerts = alerts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;

        this.data = null;
    }
    $onInit() {
        this.load();
        this.googleOauth = `${config.oAuthUrl}google?redirect_to=${this.$window.encodeURIComponent(config.baseUrl + 'preferences/integrations')}&access_token=${this.$window.localStorage.getItem('token')}`;
    }
    load() {
        return this.api.get(`user/google_accounts`, {
            sort: 'created_at'
        }).then((data) => {
            this.$log.debug('user/google_accounts', data);
            this.data = data;
        });
    }
    disconnect(id) {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to disconnect this Google account?')).then(() => {
            return this.api.delete({url: `user/google_accounts/${id}`, type: 'google_accounts'}).then(() => {
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with with Google.'));
                this.load();
            }).catch((data) => {
                this.alerts.addAlert(this.gettextCatalog.getString(`MPDX couldn't save your configuration changes for Google. {error}`, {error: data.error}), 'danger');
            }).finally(() => {
                this.saving = false;
            });
        });
    }
}

const Google = {
    template: require('./google.html'),
    controller: GoogleController
};

export default angular.module('mpdx.preferences.integrations.google.component', [])
    .component('googleIntegrationPreferences', Google).name;
