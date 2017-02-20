class SetupConnectController {
    accounts;
    api;
    preferencesOrganization;
    serverConstants;
    users;
    constructor(
        $state,
        accounts, api, preferencesOrganization, serverConstants, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.api = api;
        this.preferencesOrganization = preferencesOrganization;
        this.serverConstants = serverConstants;
        this.users = users;

        this.reset();
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'connect';
        this.users.setOption(this.users.current.options.setup_position);
        const lastId = _.get(_.last(this.users.organizationAccounts), 'id', null);
        if (lastId) {
            this.lastAdded = this.serverConstants.data.organizations[lastId];
        }
    }
    connect() {
        this.connecting = true;
    }
    add() {
        this.preferencesOrganization.createAccount(this.username, this.password, this.organization.id).then(() => {
            this.connecting = false;
            //save stuff
            this.lastAdded = this.serverConstants.data.organizations[this.organization.id];
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