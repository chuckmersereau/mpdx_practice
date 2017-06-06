import each from 'lodash/fp/each';

class MailchimpIntegrationPreferencesController {
    alerts;
    mailchimp;
    state;

    constructor(
        $rootScope, gettextCatalog,
        mailchimp, alerts, help, modal
    ) {
        this.gettextCatalog = gettextCatalog;

        this.mailchimp = mailchimp;
        this.help = help;
        this.alerts = alerts;
        this.modal = modal;

        this.saving = false;
        this.showSettings = false;

        $rootScope.$on('accountListUpdated', () => {
            this.mailchimp.load(true);
        });
    }
    $onInit() {
        this.mailchimp.load(true);
    }
    save(showSettings = false) {
        this.saving = true;
        return this.mailchimp.save().then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Preferences saved successfully'), 'success');
            this.saving = false;
            this.showSettings = false;
            return this.mailchimp.load(true).then(() => {
                this.showSettings = showSettings;
            });
        }).catch(err => {
            each(value => {
                this.alerts.addAlert(value, 'danger');
            }, err.errors);
            this.saving = false;
            throw err;
        });
    }
    sync() {
        this.saving = true;
        return this.mailchimp.sync().then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX is now syncing your newsletter recipients with MailChimp'), 'success');
        }).catch(err => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp'), 'danger');
            throw err;
        });
    }
    disconnect() {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to disconnect this MailChimp account?')).then(() => {
            this.saving = true;
            return this.mailchimp.disconnect().then(() => {
                this.showSettings = false;
                this.saving = false;
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with MailChimp'), 'success');
            }).catch(err => {
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

import gettextCatalog from 'angular-gettext';
import mailchimp from './mailchimp.service';
import alerts from 'common/alerts/alerts.service';
import help from 'common/help/help.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.preferences.integrations.mailchimp.component', [
    gettextCatalog,
    mailchimp, alerts, help, modal
]).component('mailchimpIntegrationPreferences', Mailchimp).name;
