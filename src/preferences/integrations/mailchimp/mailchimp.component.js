class MailchimpIntegrationPreferencesController {
    alertsService;
    mailchimpService;
    rolloutService;

    constructor(
        $scope, mailchimpService, alertsService, rolloutService
    ) {
        this.mailchimpService = mailchimpService;
        this.alertsService = alertsService;
        this.rolloutService = rolloutService;
        this.saving = false;
        this.showSettings = false;

        $scope.$watch(() => this.mailchimpService.state, () => {
            this.state = this.mailchimpService.state;
        });
    }
    save() {
        this.saving = true;
        this.mailchimpService.save().then(() => {
            this.alertsService.addAlert('Preferences saved successfully', 'success');
            this.saving = false;
            if (this.mailchimpService.data.primary_list_id !== null) {
                this.hide();
            }
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alertsService.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    hide() {
        this.mailchimpService.loading = true;
        this.mailchimpService.load();
        this.showSettings = false;
    }
    sync() {
        this.saving = true;
        return this.mailchimpService.sync().then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX is now syncing your newsletter recipients with Mailchimp', 'success');
        }).catch(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX couldn\'t save your configuration changes for Mailchimp', 'danger');
        });
    }
    disconnect() {
        this.saving = true;
        return this.mailchimpService.disconnect().then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed your integration with MailChimp', 'success');
            this.mailchimpService.load();
        }).catch(() => {
            this.alertsService.addAlert('MPDX couldn\'t save your configuration changes for MailChimp', 'danger');
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
