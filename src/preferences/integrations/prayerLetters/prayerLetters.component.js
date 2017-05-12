class PrayerLettersController {
    constructor(
        $log, $rootScope, gettextCatalog,
        alerts, modal, prayerLetters
    ) {
        this.$log = $log;
        this.alerts = alerts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.prayerLetters = prayerLetters;

        $rootScope.$on('accountListUpdated', () => {
            this.prayerLetters.load(true);
        });
    }
    $onInit() {
        this.prayerLetters.load(true);
    }
    sync() {
        this.saving = true;
        return this.prayerLetters.sync().then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX is now syncing your newsletter recipients with Prayer Letters'), 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Prayer Letters'), 'danger');
        });
    }
    disconnect() {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to disconnect this Prayer Letters account?')).then(() => {
            this.saving = true;
            return this.prayerLetters.disconnect().then(() => {
                this.saving = false;
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with Prayer Letters'), 'success');
            }).catch(() => {
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Prayer Letters'), 'danger');
                this.saving = false;
            });
        });
    }
}

const PrayerLetters = {
    template: require('./prayerLetters.html'),
    controller: PrayerLettersController
};

export default angular.module('mpdx.preferences.integrations.prayerLetters.component', [])
    .component('prayerLettersIntegrationsPreferences', PrayerLetters).name;
