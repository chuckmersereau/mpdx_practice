class SetupConnectController {
    accounts;
    alerts;
    api;
    preferencesOrganization;
    serverConstants;
    users;
    constructor(
        $state,
        accounts, alerts, api, preferencesOrganization, serverConstants, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.preferencesOrganization = preferencesOrganization;
        this.serverConstants = serverConstants;
        this.users = users;

        this.reset();
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'connect';
        this.users.setOption(this.users.current.options.setup_position);
    }
    connect() {
        this.connecting = true;
    }
    add() {
        const username = this.username.length > 0 ? this.username : null;
        const password = this.password.length > 0 ? this.password : null;
        this.preferencesOrganization.createAccount(username, password, this.organization).then(() => {
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
}

const SetupConnect = {
    template: require('./connect.html'),
    controller: SetupConnectController
};

export default angular.module('mpdx.setup.connect.component', [])
    .component('setupConnect', SetupConnect).name;
