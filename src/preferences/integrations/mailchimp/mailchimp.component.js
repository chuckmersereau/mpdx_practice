import each from 'lodash/fp/each';

class MailchimpIntegrationPreferencesController {
    alerts;
    mailchimp;
    state;

    constructor(
        gettextCatalog,
        mailchimp, alerts, help
    ) {
        this.gettextCatalog = gettextCatalog;

        this.mailchimp = mailchimp;
        this.help = help;
        this.alerts = alerts;

        this.saving = false;
        this.showSettings = false;
    }
    save(showSettings = false) {
        this.saving = true;
        this.mailchimp.save().then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Preferences saved successfully'), 'success');
            this.saving = false;
            this.showSettings = showSettings;
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
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX is now syncing your newsletter recipients with Mailchimp'), 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for Mailchimp'), 'danger');
        });
    }
    disconnect() {
        this.saving = true;
        return this.mailchimp.disconnect().then(() => {
            this.showSettings = false;
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with MailChimp'), 'success');
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp'), 'danger');
            this.saving = false;
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
