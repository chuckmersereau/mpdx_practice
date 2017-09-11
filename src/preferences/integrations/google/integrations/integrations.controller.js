import concat from 'lodash/fp/concat';
import pullAt from 'lodash/fp/pullAt';

class GoogleIntegrationsModalController {
    constructor(
        $log, blockUI, gettextCatalog,
        alerts, api, googleIntegrations, modal, serverConstants, google,
        googleIntegration, googleAccount
    ) {
        this.$log = $log;
        this.alerts = alerts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.google = google;
        this.googleIntegrations = googleIntegrations;
        this.modal = modal;
        this.serverConstants = serverConstants;

        this.googleIntegration = googleIntegration;
        this.googleAccount = googleAccount;

        this.blockUI = blockUI.instances.get('googleIntegrations');
        this.activeTab = 'calendar';
    }
    enable(integrationName) {
        this.blockUI.start();
        this.googleIntegrations.enable(this.googleAccount, this.googleIntegration, integrationName).then((data) => {
            this.blockUI.reset();
            this.googleIntegration = data;
        });
    }
    disable(integrationName) {
        const message = this.gettextCatalog.getString('Are you sure you want to disable Google {{name}} sync?', {
            name: integrationName
        });
        this.modal.confirm(message).then(() => {
            this.blockUI.start();
            this.googleIntegrations.disable(this.googleAccount, this.googleIntegration, integrationName)
                .then((data) => {
                    this.blockUI.reset();
                    this.googleIntegration = data;
                });
        });
    }
    sync(integrationName) {
        this.blockUI.start();
        this.googleIntegrations.sync(this.googleAccount, this.googleIntegration, integrationName).then(() => {
            this.blockUI.reset();
        });
    }
    save() {
        return this.api.put({
            url: `user/google_accounts/${this.googleAccount.id}/google_integrations/${this.googleIntegration.id}`,
            data: this.googleIntegration,
            type: 'google_integrations'
        }).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Google integration saved.'));
        }).catch((ex) => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save Google integration.'), 'danger');
            throw ex;
        });
    }
    addEmailAddress() {
        this.googleIntegration.email_blacklist = concat(this.googleIntegration.email_blacklist, null);
    }
    removeEmail(index) {
        this.googleIntegration.email_blacklist = pullAt([index], this.googleIntegration.email_blacklist);
    }
}

import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import blockUI from 'angular-block-ui';
import gettextCatalog from 'angular-gettext';
import google from '../google.service';
import googleIntegrations from './integrations.service';
import modal from 'common/modal/modal.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.preferences.integrations.google.integrations.controller', [
    blockUI, gettextCatalog,
    alerts, api, googleIntegrations, modal, serverConstants, google
]).controller('googleIntegrationsModalController', GoogleIntegrationsModalController).name;
