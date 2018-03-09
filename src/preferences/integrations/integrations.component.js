import { isNil } from 'lodash/fp';

class IntegrationPreferencesController {
    constructor(
        $window, $rootScope, $state, $stateParams, gettextCatalog,
        api, help, integrations, modal, google, mailchimp, prayerLetters
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.integrations = integrations;
        this.modal = modal;

        this.google = google;
        this.mailchimp = mailchimp;
        this.prayerLetters = prayerLetters;

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

import api from '../../common/api/api.service';
import google from './google/google.service';
import help from '../../common/help/help.service';
import integrations from './integrations.service';
import mailchimp from './mailchimp/mailchimp.service';
import modal from '../../common/modal/modal.service';
import prayerLetters from './prayerLetters/prayerLetters.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.preferences.integrations.component', [
    uiRouter,
    api, help, google, integrations, mailchimp, modal, prayerLetters
]).component('preferencesIntegration', Integrations).name;
