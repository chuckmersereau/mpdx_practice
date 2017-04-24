import get from 'lodash/fp/get';

class OrganizationIntegrationPreferencesController {
    alerts;
    preferencesOrganization;
    selectedKey;
    serverConstants;
    users;

    constructor(
        gettextCatalog,
        alerts, help, preferencesOrganization, serverConstants, users,
    ) {
        this.gettextCatalog = gettextCatalog;

        this.alerts = alerts;
        this.help = help;
        this.preferencesOrganization = preferencesOrganization;
        this.serverConstants = serverConstants;
        this.users = users;

        this.saving = false;
        this.page = 'org_list';
        this.selected = null;
        this.username = null;
        this.password = null;
    }
    save() {
        this.saving = true;
        this.preferencesOrganization.save().then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Preferences saved successfully'));
            this.users.listOrganizationAccounts(true);
            this.saving = false;
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save preferences'), 'danger');
            this.saving = false;
        });
    }
    disconnect(id) {
        this.saving = true;
        return this.preferencesOrganization.disconnect(id).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your organization integration'));
            this.users.listOrganizationAccounts(true);
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString(`MPDX couldn't save your configuration changes for that organization`), 'danger');
            this.saving = false;
        });
    }
    createAccount() {
        this.saving = true;
        return this.preferencesOrganization.createAccount(this.username, this.password, this.selectedKey).then(() => {
            this.saving = false;
            this.users.listOrganizationAccounts(true);
            this.revert();
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX added your organization account'));
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to add your organization account'), 'danger');
            this.saving = false;
        });
    }
    updateAccount() {
        this.saving = true;
        return this.preferencesOrganization.updateAccount(this.username, this.password, this.selected.id).then(() => {
            this.saving = false;
            this.users.listOrganizationAccounts(true);
            this.revert();
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX updated your organization account'));
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to update your organization account'), 'danger');
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
    select() {
        this.selected = get(this.selectedKey, this.serverConstants.data.organizations_attributes);
    }
    showOrganizationHelp() {
        this.help.showArticle(this.gettextCatalog.getString('58f96cc32c7d3a057f886e20'));
    }
}

const Organization = {
    controller: OrganizationIntegrationPreferencesController,
    template: require('./organization.html')
};

export default angular.module('mpdx.preferences.organization.component', [])
    .component('organizationIntegrationPreferences', Organization).name;
