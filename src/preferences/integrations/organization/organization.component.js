class OrganizationIntegrationPreferencesController {
    constructor(
        organizationService, alertsService
    ) {
        this.preferences = organizationService;
        this.alerts = alertsService;
        this.saving = false;
        this.page = 'org_list';
        this.selected = null;
        this.username = null;
        this.password = null;
        this.account_list_id = organizationService.account_list_id;
    }
    save() {
        this.saving = true;
        this.preferences.save(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.saving = false;
            if (this.preferences.data.primary_list_id !== null) {
                this.hide();
            }
        }, (data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    hide() {
        this.preferences.loading = true;
        this.preferences.load();
        this.showSettings = false;
    }
    disconnect(id) {
        this.saving = true;
        this.preferences.disconnect(id, () => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed your organization integration', 'success');
            this.preferences.load();
        }, () => {
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for that organization', 'danger');
            this.saving = false;
        });
    }
    createAccount() {
        this.saving = true;
        this.preferences.createAccount(this.username, this.password, this.selected.id, () => {
            this.saving = false;
            this.preferences.load();
            this.revert();
            this.alerts.addAlert('MPDX added your organization account', 'success');
        }, (data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    updateAccount() {
        this.saving = true;
        this.preferences.updateAccount(this.username, this.password, this.selected.id, () => {
            this.saving = false;
            this.preferences.load();
            this.revert();
            this.alerts.addAlert('MPDX updated your organization account', 'success');
        }, (data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    editAccount(account) {
        this.page = 'edit_account';
        this.selected = account;
        this.username = account.username;
    }
    revert() {
        this.page = 'org_list';
        this.selected = null;
        this.username = null;
        this.password = null;
    }
}

const Organization = {
    controller: OrganizationIntegrationPreferencesController,
    controllerAs: 'vm',
    template: require('./organization.html')
};

export default angular.module('mpdx.preferences.organization.component', [])
    .component('organizationIntegrationPreferences', Organization).name;
