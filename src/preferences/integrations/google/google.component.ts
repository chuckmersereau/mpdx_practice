import 'angular-gettext';
import google, { GoogleService } from './google.service';
import googleIntegrations, { GoogleIntegrationsService } from './integrations/integrations.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

class GoogleController {
    saving: boolean;
    watcher: () => void;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $log: ng.ILogService,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private modal: ModalService,
        private google: GoogleService,
        private googleIntegrations: GoogleIntegrationsService
    ) {
        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.google.load(true);
        });
    }
    $onInit() {
        this.google.load(true);
    }
    $onDestroy() {
        this.watcher();
    }
    disconnect(id) {
        const msg = this.gettextCatalog.getString('Are you sure you wish to disconnect this Google account?');
        return this.modal.confirm(msg).then(() => {
            const successMessage = this.gettextCatalog.getString('MPDX removed your integration with Google.');
            const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Google.');
            return this.google.disconnect(id, successMessage, errorMessage).then(() => {
                this.saving = false;
            }).catch(() => {
                this.saving = false;
            });
        });
    }
}

const Google = {
    template: require('./google.html'),
    controller: GoogleController
};

export default angular.module('mpdx.preferences.integrations.google.component', [
    'gettext',
    google, googleIntegrations, modal
]).component('googleIntegrationPreferences', Google).name;
