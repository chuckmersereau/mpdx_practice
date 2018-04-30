class PrayerLettersController {
    saving: boolean;
    constructor(
        private $log: ng.ILogService,
        $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private modal: ModalService,
        private prayerLetters: PrayerLettersService
    ) {
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

import api, { ApiService } from '../../../common/api/api.service';
import 'angular-gettext';
import modal, { ModalService } from '../../../common/modal/modal.service';
import prayerLetters, { PrayerLettersService } from './prayerLetters.service';

export default angular.module('mpdx.preferences.integrations.prayerLetters.component', [
    'gettext',
    api, modal, prayerLetters
]).component('prayerLettersIntegrationsPreferences', PrayerLetters).name;
