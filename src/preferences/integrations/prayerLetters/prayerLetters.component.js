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
        }).catch((err) => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Prayer Letters'), 'danger');
            throw err;
        });
    }
    disconnect() {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to disconnect this Prayer Letters account?')).then(() => {
            this.saving = true;
            return this.prayerLetters.disconnect().then(() => {
                this.saving = false;
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with Prayer Letters'), 'success');
            }).catch((err) => {
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Prayer Letters'), 'danger');
                this.saving = false;
                throw err;
            });
        });
    }
}

const PrayerLetters = {
    template: require('./prayerLetters.html'),
    controller: PrayerLettersController
};

import gettextCatalog from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';
import modal from 'common/modal/modal.service';
import prayerLetters from './prayerLetters.service';

export default angular.module('mpdx.preferences.integrations.prayerLetters.component', [
    gettextCatalog,
    alerts, modal, prayerLetters
]).component('prayerLettersIntegrationsPreferences', PrayerLetters).name;