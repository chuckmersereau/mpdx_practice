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
        this.preferencesOrganization.createAccount(this.username, this.password, this.organization).then(() => {
            this.users.listOrganizationAccounts(true).then(() => {
                this.connecting = false;
            });
        }).catch(() => {
            this.alerts.addAlert('Invalid username or password.');
        });
    }
    next() {
        this.accounts.load(true).then(() => {
            if (this.accounts.data.length > 1) {
                this.$state.go('setup.account');
            } else {
                this.$state.go('setup.preferences.personal');
            }
        });
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
