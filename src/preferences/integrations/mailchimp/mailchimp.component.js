class MailchimpIntegrationPreferencesController {
    alerts;
    mailchimp;
    state;

    constructor(
        $scope, mailchimp, alerts
    ) {
        this.mailchimp = mailchimp;
        this.alerts = alerts;
        this.saving = false;
        this.showSettings = false;

        $scope.$watch(() => this.mailchimp.state, () => {
            this.state = this.mailchimp.state;
        });
    }
    $onInit() {
        this.mailchimp.load();
    }
    save() {
        this.saving = true;
        this.mailchimp.save().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.saving = false;
            if (this.mailchimp.data.primary_list_id !== null) {
                this.hide();
            }
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    hide() {
        this.mailchimp.load();
        this.showSettings = false;
    }
    sync() {
        this.saving = true;
        return this.mailchimp.sync().then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX is now syncing your newsletter recipients with Mailchimp', 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for Mailchimp', 'danger');
        });
    }
    disconnect() {
        this.saving = true;
        return this.mailchimp.disconnect().then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed your integration with MailChimp', 'success');
            this.mailchimp.load();
        }).catch(() => {
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for MailChimp', 'danger');
            this.saving = false;
        });
    }
}

const Mailchimp = {
    controller: MailchimpIntegrationPreferencesController,
    template: require('./mailchimp.html'),
    bindings: {
        'state': '='
    }
};

export default angular.module('mpdx.preferences.integrations.mailchimp.component', [])
        .component('mailchimpIntegrationPreferences', Mailchimp).name;
