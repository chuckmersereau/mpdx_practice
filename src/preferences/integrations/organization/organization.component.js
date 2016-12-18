class OrganizationIntegrationPreferencesController {
    alerts;
    preferencesOrganization;

    constructor(
        preferencesOrganization, alerts
    ) {
        this.preferencesOrganization = preferencesOrganization;
        this.alerts = alerts;

        this.saving = false;
        this.page = 'org_list';
        this.selected = null;
        this.username = null;
        this.password = null;
    }
    save() {
        this.saving = true;
        this.preferencesOrganization.save().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.saving = false;
            if (this.preferencesOrganization.data.primary_list_id !== null) {
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
        this.preferencesOrganization.loading = true;
        this.preferencesOrganization.load();
        this.showSettings = false;
    }
    disconnect(id) {
        this.saving = true;
        return this.preferencesOrganization.disconnect(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed your organization integration', 'success');
            return this.preferencesOrganization.load();
        }).catch(() => {
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for that organization', 'danger');
            this.saving = false;
        });
    }
    createAccount() {
        this.saving = true;
        return this.preferencesOrganization.createAccount(this.username, this.password, this.selected.id).then(() => {
            this.saving = false;
            this.preferencesOrganization.load();
            this.revert();
            this.alerts.addAlert('MPDX added your organization account', 'success');
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    updateAccount() {
        this.saving = true;
        return this.preferencesOrganization.updateAccount(this.username, this.password, this.selected.id).then(() => {
            this.saving = false;
            this.preferencesOrganization.load();
            this.revert();
            this.alerts.addAlert('MPDX updated your organization account', 'success');
        }).catch((data) => {
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
    template: require('./organization.html')
};

export default angular.module('mpdx.preferences.organization.component', [])
    .component('organizationIntegrationPreferences', Organization).name;
