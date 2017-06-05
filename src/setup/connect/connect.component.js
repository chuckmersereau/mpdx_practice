import get from 'lodash/fp/get';

class SetupConnectController {
    accounts;
    alerts;
    api;
    selectedKey;
    preferencesOrganization;
    serverConstants;
    users;
    constructor(
        $state, gettextCatalog,
        accounts, alerts, api, help, preferencesOrganization, serverConstants, users
    ) {
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;

        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.help = help;
        this.preferencesOrganization = preferencesOrganization;
        this.serverConstants = serverConstants;
        this.users = users;

        this.reset();
    }
    $onInit() {
        this.users.currentOptions.setup_position.value = 'connect';
        this.users.setOption(this.users.currentOptions.setup_position);
        this.showOrgs = this.users.organizationAccounts.length === 0;
    }
    connect() {
        this.connecting = true;
    }
    add() {
        return this.preferencesOrganization.createAccount(this.username, this.password, this.selectedKey).then(() => {
            return this.users.listOrganizationAccounts(true).then(() => {
                this.connecting = false;
                this.showOrgs = false;
            });
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString('Invalid username or password.'), 'danger');
            throw err;
        });
    }
    next() {
        this.$state.go('setup.account');
    }
    reset() {
        this.organization = null;
        this.connecting = false;
        this.username = "";
        this.password = "";
    }
    select() {
        this.selected = get(this.selectedKey, this.serverConstants.data.organizations_attributes);
    }
    showOrganizationHelp() {
        this.help.showArticle(this.gettextCatalog.getString('58f96cc32c7d3a057f886e20'));
    }
}

const SetupConnect = {
    template: require('./connect.html'),
    controller: SetupConnectController
};

import uiRouter from 'angular-ui-router';
import gettextCatalog from 'angular-gettext';
import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import help from 'common/help/help.service';
import preferencesOrganization from 'preferences/integrations/organization/organization.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.setup.connect.component', [
    uiRouter, gettextCatalog,
    accounts, alerts, api, help, preferencesOrganization, serverConstants, users
]).component('setupConnect', SetupConnect).name;
