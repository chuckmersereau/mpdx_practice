import config from 'config';
import { each } from 'lodash/fp';

class MailchimpIntegrationPreferencesController {
    constructor(
        $log, $rootScope, $window, gettextCatalog,
        api, alerts, help, mailchimp, modal
    ) {
        this.$log = $log;
        this.$window = $window;
        this.alerts = alerts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.help = help;
        this.mailchimp = mailchimp;
        this.modal = modal;

        this.saving = false;
        this.showSettings = false;

        $rootScope.$on('accountListUpdated', () => {
            this.mailchimp.load();
        });
    }
    $onInit() {
        this.oAuth = `${config.oAuthUrl}mailchimp?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.encodeURIComponent(config.baseUrl + 'preferences/integrations?selectedTab=mailchimp')}&access_token=${this.$window.localStorage.getItem('token')}`;
        this.mailchimp.load();
    }
    save(showSettings = false) {
        this.saving = true;
        return this.api.post({ url: `account_lists/${this.api.account_list_id}/mail_chimp_account`, data: this.mailchimp.data }).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Preferences saved successfully'), 'success');
            this.saving = false;
            this.showSettings = false;
            return this.mailchimp.load().then(() => {
                this.showSettings = showSettings;
            });
        }).catch((err) => {
            each((value) => {
                this.alerts.addAlert(value, 'danger');
            }, err.errors);
            this.saving = false;
            throw err;
        });
    }
    sync() {
        this.saving = true;
        return this.api.get(`account_lists/${this.api.account_list_id}/mail_chimp_account/sync`).then(() => {
            this.saving = false;
            const message = this.gettextCatalog.getString('Your MailChimp sync has been started. This process may take 2-4 hours to complete.');
            this.modal.info(message);
        }).catch((err) => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp'), 'danger');
            throw err;
        });
    }
    disconnect() {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to disconnect this MailChimp account?')).then(() => {
            this.saving = true;
            return this.api.delete(`account_lists/${this.api.account_list_id}/mail_chimp_account`).then(() => {
                this.mailchimp.data = null;
                this.showSettings = false;
                this.saving = false;
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with MailChimp'), 'success');
            }).catch((err) => {
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp'), 'danger');
                this.saving = false;
                throw err;
            });
        });
    }
    showHelp() {
        this.help.showHelp();
    }
}

const Mailchimp = {
    controller: MailchimpIntegrationPreferencesController,
    template: require('./mailchimp.html')
};

import api from 'common/api/api.service';
import gettextCatalog from 'angular-gettext';
import mailchimp from './mailchimp.service';
import alerts from 'common/alerts/alerts.service';
import help from 'common/help/help.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.preferences.integrations.mailchimp.component', [
    gettextCatalog,
    api, mailchimp, alerts, help, modal
]).component('mailchimpIntegrationPreferences', Mailchimp).name;
