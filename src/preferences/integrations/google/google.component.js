class GoogleController {
    constructor(
        $rootScope, $log, $window, gettextCatalog,
        modal, google, googleIntegrations
    ) {
        this.$log = $log;
        this.$window = $window;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.google = google;
        this.googleIntegrations = googleIntegrations;

        $rootScope.$on('accountListUpdated', () => {
            this.google.load(true);
        });
    }
    $onInit() {
        this.google.load(true);
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

import gettext from 'angular-gettext';
import google from './google.service';
import googleIntegrations from './integrations/integrations.service';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.preferences.integrations.google.component', [
    gettext,
    google, googleIntegrations, modal, serverConstants
]).component('googleIntegrationPreferences', Google).name;
