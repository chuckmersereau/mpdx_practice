import get from 'lodash/fp/get';
import last from 'lodash/fp/last';

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
        this.getLastAdded();
    }
    connect() {
        this.connecting = true;
    }
    getLastAdded() {
        this.lastAdded = get('organization.name', last(this.users.organizationAccounts));
    }
    add() {
        this.preferencesOrganization.createAccount(this.username, this.password, this.organization).then(() => {
            this.users.listOrganizationAccounts().then(() => {
                this.connecting = false;
                this.getLastAdded();
            });
        }).catch(() => {
            this.alerts.addAlert('Invalid username or password.');
        });
    }
    next() {
        if (this.accounts.data.length > 1) {
            this.$state.go('setup.merge');
        } else {
            this.$state.go('setup.preferences');
        }
    }
    reset() {
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