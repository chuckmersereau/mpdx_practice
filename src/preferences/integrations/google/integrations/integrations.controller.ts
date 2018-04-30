import { concat, pullAt } from 'lodash/fp';

class GoogleIntegrationsModalController {
    activeTab: string;
    blockUI: IBlockUIService;
    constructor(
        private $log: ng.ILogService,
        blockUI: IBlockUIService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private googleIntegrations: GoogleIntegrationsService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService,
        private google: GoogleService,
        private googleIntegration: any,
        private googleAccount: any
    ) {
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
        const successMessage = this.gettextCatalog.getString('Google integration saved.');
        const errorMessage = this.gettextCatalog.getString('Unable to save Google integration.');
        return this.api.put({
            url: `user/google_accounts/${this.googleAccount.id}/google_integrations/${this.googleIntegration.id}`,
            data: this.googleIntegration,
            type: 'google_integrations',
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    addEmailAddress() {
        this.googleIntegration.email_blacklist = concat(this.googleIntegration.email_blacklist, null);
    }
    removeEmail(index) {
        this.googleIntegration.email_blacklist = pullAt([index], this.googleIntegration.email_blacklist);
    }
}

import 'angular-block-ui';
import 'angular-gettext';
import google, { GoogleService } from '../google.service';
import googleIntegrations, { GoogleIntegrationsService } from './integrations.service';
import api, { ApiService } from '../../../../common/api/api.service';
import modal, { ModalService } from '../../../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.preferences.integrations.google.integrations.controller', [
    'blockUI', 'gettext',
    api, googleIntegrations, modal, serverConstants, google
]).controller('googleIntegrationsModalController', GoogleIntegrationsModalController).name;
