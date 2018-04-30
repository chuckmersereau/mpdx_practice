import { isNil } from 'lodash/fp';

class IntegrationPreferencesController {
    mailchimpAccStatus: string;
    saving: boolean;
    selectedTab: string;
    tabId: string;
    constructor(
        private $window: ng.IWindowService,
        $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private $stateParams: StateParams,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private help: HelpService,
        private integrations: IntegrationsService,
        private modal: ModalService,
        private google: GoogleService,
        private mailchimp: MailchimpService,
        private prayerLetters: PrayerLettersService
    ) {
        this.saving = false;
        this.tabId = '';

        this.mailchimpAccStatus = 'disabled';

        $window.openerCallback = this.reload;

        help.suggest([
            this.gettextCatalog.getString('5845aa229033600698176a54'),
            this.gettextCatalog.getString('5845ae09c6979106d373a589'),
            this.gettextCatalog.getString('5845a7f49033600698176a48'),
            this.gettextCatalog.getString('5845a6de9033600698176a43'),
            this.gettextCatalog.getString('5845af08c6979106d373a593'),
            this.gettextCatalog.getString('5845ae86c6979106d373a58c'),
            this.gettextCatalog.getString('5845af809033600698176a8c'),
            this.gettextCatalog.getString('584717b1c6979106d373afab'),
            this.gettextCatalog.getString('5848254b9033600698177ac7'),
            this.gettextCatalog.getString('57e1810ec697910d0784c3e1'),
            this.gettextCatalog.getString('584718e390336006981774ee')
        ]);

        $rootScope.$on('accountListUpdated', () => {
            this.integrations.load();
        });
    }
    $onInit() {
        this.integrations.load();
        if (this.$stateParams.selectedTab) {
            this.setTab(this.$stateParams.selectedTab);
        }
    }
    $onChanges(data) {
        if (data.selectedTab) {
            this.setTab(this.selectedTab);
        }
    }
    disconnect(service, id) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX removed your integration with {{service}}.', { service: service });
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for {{service}}.', { service: service });
        const serviceToDisconnect = service.toLowerCase();
        if (serviceToDisconnect === 'key') {
            return this.api.delete(
                `user/key_accounts/${id}`,
                undefined, successMessage, errorMessage
            ).then(() => {
                this.saving = false;
                this.integrations.load();
            }).catch((err) => {
                this.saving = false;
                throw err;
            });
        }
    }
    reload() {
        this.integrations.load();
    }
    sendToChalkline() {
        this.modal.confirm(this.gettextCatalog.getString('Would you like MPDX to email Chalkline your newsletter list and open their order form in a new tab?')).then(() => {
            this.integrations.sendToChalkline().then(() => {
                this.$window.open('http://www.chalkline.org/order_mpdx.html', '_blank');
            });
        });
    }
    setTab(service) {
        if (!this.tabSelectable(service)) {
            return;
        }
        if ((service === '' || this.tabId === service) && !this.selectedTab) {
            this.tabId = '';
        } else {
            this.tabId = service;
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
    tabSelectable(service) {
        return (this.selectedTab && this.selectedTab === service) || isNil(this.selectedTab);
    }
}

const Integrations = {
    controller: IntegrationPreferencesController,
    template: require('./integrations.html'),
    bindings: {
        selectedTab: '<',
        setup: '<',
        onSave: '&'
    }
};

import api, { ApiService } from '../../common/api/api.service';
import google, { GoogleService } from './google/google.service';
import help, { HelpService } from '../../common/help/help.service';
import integrations, { IntegrationsService } from './integrations.service';
import mailchimp, { MailchimpService } from './mailchimp/mailchimp.service';
import modal, { ModalService } from '../../common/modal/modal.service';
import prayerLetters, { PrayerLettersService } from './prayerLetters/prayerLetters.service';
import uiRouter from '@uirouter/angularjs';
import { StateParams, StateService } from '@uirouter/core';

export default angular.module('mpdx.preferences.integrations.component', [
    uiRouter,
    api, google, help, integrations, mailchimp, modal, prayerLetters
]).component('preferencesIntegration', Integrations).name;
