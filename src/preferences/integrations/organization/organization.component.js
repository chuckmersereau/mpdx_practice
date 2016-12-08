class OrganizationIntegrationPreferencesController {
    alertsService;
    organizationService;

    constructor(
        organizationService, alertsService
    ) {
        this.organizationService = organizationService;
        this.alertsService = alertsService;

        this.saving = false;
        this.page = 'org_list';
        this.selected = null;
        this.username = null;
        this.password = null;
    }
    save() {
        this.saving = true;
        this.organizationService.save().then(() => {
            this.alertsService.addAlert('Preferences saved successfully', 'success');
            this.saving = false;
            if (this.organizationService.data.primary_list_id !== null) {
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
        this.organizationService.loading = true;
        this.organizationService.load();
        this.showSettings = false;
    }
    disconnect(id) {
        this.saving = true;
        return this.organizationService.disconnect(id).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed your organization integration', 'success');
            return this.organizationService.load();
        }).catch(() => {
            this.alertsService.addAlert('MPDX couldn\'t save your configuration changes for that organization', 'danger');
            this.saving = false;
        });
    }
    createAccount() {
        this.saving = true;
        return this.organizationService.createAccount(this.username, this.password, this.selected.id).then(() => {
            this.saving = false;
            this.organizationService.load();
            this.revert();
            this.alertsService.addAlert('MPDX added your organization account', 'success');
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alertsService.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    updateAccount() {
        this.saving = true;
        return this.organizationService.updateAccount(this.username, this.password, this.selected.id).then(() => {
            this.saving = false;
            this.organizationService.load();
            this.revert();
            this.alertsService.addAlert('MPDX updated your organization account', 'success');
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alertsService.addAlert(value, 'danger');
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
    template: require('./organization.html')
};

export default angular.module('mpdx.preferences.organization.component', [])
    .component('organizationIntegrationPreferences', Organization).name;
