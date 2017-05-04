class GoogleController {
    constructor(
        $rootScope, $log, $window, gettextCatalog,
        alerts, modal, google
    ) {
        this.$log = $log;
        this.$window = $window;
        this.alerts = alerts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.google = google;

        $rootScope.$on('accountListUpdated', () => {
            this.google.load(true);
        });
    }
    $onInit() {
        this.google.load(true);
    }
    disconnect(id) {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to disconnect this Google account?')).then(() => {
            return this.google.disconnect(id).then(() => {
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with with Google.'));
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
