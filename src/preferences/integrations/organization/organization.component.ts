import 'angular-gettext';
import * as Upload from 'ng-file-upload';
import { get } from 'lodash/fp';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import help, { HelpService } from '../../../common/help/help.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import preferencesOrganization, { PreferencesOrganizationService } from './organization.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import users, { UsersService } from '../../../common/users/users.service';

class OrganizationIntegrationPreferencesController {
    importing: boolean;
    page: string;
    password: string;
    saving: boolean;
    selected: any;
    selectedKey: string;
    username: string;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private Upload: ng.angularFileUpload.IUploadService,
        private alerts: AlertsService,
        private help: HelpService,
        private modal: ModalService,
        private preferencesOrganization: PreferencesOrganizationService,
        private serverConstants: ServerConstantsService,
        private users: UsersService
    ) {
        this.saving = false;
        this.page = 'org_list';
        this.selected = null;
        this.username = null;
        this.password = null;
    }
    $onInit() {
        this.users.listOrganizationAccounts();
        this.$rootScope.$on('accountListUpdated', () => {
            this.users.listOrganizationAccounts(true);
        });
    }
    save() {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('Preferences saved successfully');
        const errorMessage = this.gettextCatalog.getString('Unable to save preferences');
        return this.preferencesOrganization.save(successMessage, errorMessage).then(() => {
            this.users.listOrganizationAccounts(true);
            this.saving = false;
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    disconnect(id) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX removed your organization integration');
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for that organization');
        return this.preferencesOrganization.disconnect(id, successMessage, errorMessage).then(() => {
            this.saving = false;
            this.users.listOrganizationAccounts(true);
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    createAccount() {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX added your organization account');
        const errorMessage = this.gettextCatalog.getString('Unable to add your organization account');
        return this.preferencesOrganization.createAccount(
            this.username, this.password, this.selectedKey, successMessage, errorMessage
        ).then(() => {
            this.saving = false;
            this.users.listOrganizationAccounts(true);
            this.revert();
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    updateAccount() {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX updated your organization account');
        const errorMessage = this.gettextCatalog.getString('Unable to update your organization account');
        return this.preferencesOrganization.updateAccount(
            this.username, this.password, this.selected.id, successMessage, errorMessage
        ).then(() => {
            this.saving = false;
            this.users.listOrganizationAccounts(true);
            this.revert();
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    editAccount(account) {
        this.page = 'edit_account';
        this.selected = account;
        this.username = account.username;
    }
    revert() {
        this.selected = null;
        this.username = null;
        this.password = null;
        this.page = 'org_list';
    }
    select() {
        this.selected = get(this.selectedKey, this.serverConstants.data.organizations_attributes);
    }
    showOrganizationHelp() {
        this.help.showArticle(this.gettextCatalog.getString('58f96cc32c7d3a057f886e20'));
    }
    import(account) {
        this.importing = true;
        return this.preferencesOrganization.import(account).then(() => {
            account.showTntDataSync = false;
            this.modal.info(
                this.gettextCatalog.getString('File successfully uploaded. The import to {{ name }} will begin in the background.', { name: account.organization.name }, null), 'success');
            account.file = null;
            this.importing = false;
        }).catch((err) => {
            this.alerts.addAlert(this.gettextCatalog.getString('File upload failed.'), 'danger');
            account.file = null;
            this.importing = false;
            throw err;
        });
    }
    authenticate(organizationId) {
        this.saving = true;
        this.$window.location.href = this.preferencesOrganization.oAuth(organizationId);
    }
}

const Organization = {
    controller: OrganizationIntegrationPreferencesController,
    template: require('./organization.html')
};

export default angular.module('mpdx.preferences.organization.component', [
    'gettext', Upload,
    alerts, help, modal, preferencesOrganization, serverConstants, users
]).component('organizationIntegrationPreferences', Organization).name;
