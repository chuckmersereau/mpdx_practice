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
    }
    connect() {
        this.connecting = true;
    }
    add() {
        this.preferencesOrganization.createAccount(this.username, this.password, this.selectedKey).then(() => {
            this.users.listOrganizationAccounts(true).then(() => {
                this.connecting = false;
            });
        }).catch(() => {
            this.alerts.addAlert('Invalid username or password.', 'danger');
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

export default angular.module('mpdx.setup.connect.component', [])
    .component('setupConnect', SetupConnect).name;
