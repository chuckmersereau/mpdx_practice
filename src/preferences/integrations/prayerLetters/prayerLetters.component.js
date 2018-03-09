class PrayerLettersController {
    constructor(
        $log, $rootScope, gettextCatalog,
        api, modal, prayerLetters
    ) {
        this.$log = $log;
        this.api = api;
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
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Prayer Letters');
        const successMessage = this.gettextCatalog.getString('MPDX is now syncing your newsletter recipients with Prayer Letters');
        return this.api.get(
            `account_lists/${this.api.account_list_id}/prayer_letters_account/sync`,
            undefined, successMessage, errorMessage
        ).then(() => {
            this.saving = false;
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    disconnect() {
        const msg = this.gettextCatalog.getString('Are you sure you wish to disconnect this Prayer Letters account?');
        return this.modal.confirm(msg).then(() => {
            this.saving = true;
            const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Prayer Letters');
            const successMessage = this.gettextCatalog.getString('MPDX removed your integration with Prayer Letters');
            return this.prayerLetters.disconnect(successMessage, errorMessage).then(() => {
                this.saving = false;
            }).catch((err) => {
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

import api from '../../../common/api/api.service';
import gettextCatalog from 'angular-gettext';
import modal from 'common/modal/modal.service';
import prayerLetters from './prayerLetters.service';

export default angular.module('mpdx.preferences.integrations.prayerLetters.component', [
    gettextCatalog,
    api, modal, prayerLetters
]).component('prayerLettersIntegrationsPreferences', PrayerLetters).name;
