import { get } from 'lodash/fp';

class ConnectController {
    constructor(
        $rootScope, $window,
        gettextCatalog,
        accounts, alerts, api, help, preferencesOrganization, serverConstants, users, setup
    ) {
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.gettextCatalog = gettextCatalog;

        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.help = help;
        this.preferencesOrganization = preferencesOrganization;
        this.serverConstants = serverConstants;
        this.setup = setup;
        this.users = users;
    }
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
        return this.preferencesOrganization.createAccount(this.username, this.password, this.selectedKey).then(() => {
            return this.users.listOrganizationAccounts(true).then(() => {
                this.saving = false;
                this.addOrganization = false;
                this.username = '';
                this.password = '';
            });
        }).catch((err) => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('Invalid username or password.'), 'danger');
            throw err;
        });
    }
    disconnect(id) {
        this.saving = true;
        return this.preferencesOrganization.disconnect(id).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your organization integration'));
            return this.users.listOrganizationAccounts(true).then(() => {
                this.addOrganization = this.users.organizationAccounts.length === 0;
            });
        }).catch((err) => {
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for that organization'), 'danger');
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

import gettextCatalog from 'angular-gettext';
import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import help from 'common/help/help.service';
import preferencesOrganization from 'preferences/integrations/organization/organization.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import setup from 'setup/setup.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.setup.connect.component', [
    gettextCatalog,
    accounts, alerts, api, help, preferencesOrganization, serverConstants, setup, users
]).component('setupConnect', Connect).name;
