import config from 'config';

class PrayerLettersController {
    constructor(
        $log, $rootScope, $window, gettextCatalog,
        alerts, api
    ) {
        this.$log = $log;
        this.$window = $window;
        this.api = api;
        this.alerts = alerts;
        this.gettextCatalog = gettextCatalog;
        this.data = null;
        this.plsOAuth = '';

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
        this.plsOauth = `${config.oAuthUrl}prayer_letters?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.location.href}&access_token=${this.$window.localStorage.getItem('token')}`;
    }
    load() {
        this.api.get(`account_lists/${this.api.account_list_id}/prayer_letters_account`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/prayer_letters_account`, data);
            this.data = data;
        });
    }
    sync() {
        this.saving = true;
        return this.api.get(`account_lists/${this.api.account_list_id}/prayer_letters_account/sync`).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX is now syncing your newsletter recipients with Prayer Letters.'), 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString(`MPDX couldn't save your configuration changes for Prayer Letters.`), 'danger');
        });
    }
    disconnect() {
        this.saving = true;
        return this.api.delete(`account_lists/${this.api.account_list_id}/prayer_letters_account`).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with with Prayer Letters.'), 'success');
            this.load();
        }).catch((data) => {
            this.alerts.addAlert(this.gettextCatalog.getString(`MPDX couldn't save your configuration changes for Prayer Letters. {error}`, {error: data.error}), 'danger');
            this.saving = false;
        });
    }
}

const PrayerLetters = {
    template: require('./prayerLetters.html'),
    controller: PrayerLettersController
};

export default angular.module('mpdx.preferences.integrations.prayerLetters.component', [])
    .component('prayerLettersIntegrationsPreferences', PrayerLetters).name;
