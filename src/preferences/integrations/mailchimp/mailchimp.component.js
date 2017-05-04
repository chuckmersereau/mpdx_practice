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
        this.mailchimp.save().then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Preferences saved successfully'), 'success');
            this.saving = false;
            this.showSettings = false;
            return this.hide(showSettings);
        }).catch((data) => {
            each(value => {
                this.alerts.addAlert(value, 'danger');
            }, data.errors);
            this.saving = false;
        });
    }
    hide(showSettings = false) {
        return this.mailchimp.load(true).then(() => {
            this.showSettings = showSettings;
        });
    }
    sync() {
        this.saving = true;
        return this.mailchimp.sync().then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX is now syncing your newsletter recipients with MailChimp'), 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp'), 'danger');
        });
    }
    disconnect() {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to disconnect this MailChimp account?')).then(() => {
            this.saving = true;
            return this.mailchimp.disconnect().then(() => {
                this.showSettings = false;
                this.saving = false;
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with MailChimp'), 'success');
            }).catch(() => {
                this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp'), 'danger');
                this.saving = false;
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

export default angular.module('mpdx.preferences.integrations.mailchimp.component', [])
        .component('mailchimpIntegrationPreferences', Mailchimp).name;
