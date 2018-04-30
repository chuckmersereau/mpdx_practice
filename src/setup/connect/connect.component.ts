import { get } from 'lodash/fp';

class ConnectController {
    addOrganization: boolean;
    organization: any;
    password: string;
    saving: boolean;
    selected: any;
    selectedKey: string;
    username: string;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private api: ApiService,
        private help: HelpService,
        private preferencesOrganization: PreferencesOrganizationService,
        private serverConstants: ServerConstantsService,
        private users: UsersService,
        private setup: SetupService
    ) {}
    $onInit() {
        this.reset();
        this.users.listOrganizationAccounts().then(() => {
            this.addOrganization = this.users.organizationAccounts.length === 0;
        });
        this.$rootScope.$on('accountListUpdated', () => {
            this.users.listOrganizationAccounts(true);
        });
    }
    add() {
        this.saving = true;
        const errorMessage = this.gettextCatalog.getString('Invalid username or password.');
        return this.preferencesOrganization.createAccount(
            this.username, this.password, this.selectedKey, undefined, errorMessage
        ).then(() => {
            return this.users.listOrganizationAccounts(true).then(() => {
                this.saving = false;
                this.addOrganization = false;
                this.username = '';
                this.password = '';
            });
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
            return this.users.listOrganizationAccounts(true).then(() => {
                this.addOrganization = this.users.organizationAccounts.length === 0;
            });
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    reset() {
        this.addOrganization = false;
        this.saving = false;
        this.organization = null;
        this.username = '';
        this.password = '';
    }
    select() {
        this.selected = get(this.selectedKey, this.serverConstants.data.organizations_attributes);
    }
    next() {
        this.saving = true;
        return this.setup.next().then(() => {
            this.saving = false;
        });
    }
    showOrganizationHelp() {
        this.help.showArticle(this.gettextCatalog.getString('58f96cc32c7d3a057f886e20'));
    }
    authenticate(organizationId) {
        this.saving = true;
        this.$window.location.href = this.preferencesOrganization.oAuth(organizationId, 'setup/connect');
    }
}

const Connect = {
    template: require('./connect.html'),
    controller: ConnectController
};

import 'angular-gettext';
import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import api, { ApiService } from '../../common/api/api.service';
import help, { HelpService } from '../../common/help/help.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';
import users, { UsersService } from '../../common/users/users.service';
import setup, { SetupService } from '../setup.service';
import preferencesOrganization, { PreferencesOrganizationService } from '../../preferences/integrations/organization/organization.service';

export default angular.module('mpdx.setup.connect.component', [
    'gettext',
    accounts, api, help, preferencesOrganization, serverConstants, setup, users
]).component('setupConnect', Connect).name;
