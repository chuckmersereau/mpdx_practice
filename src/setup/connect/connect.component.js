class SetupConnectController {
    accounts;
    api;
    serverConstants;
    constructor(
        $state,
        accounts, api, serverConstants, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.api = api;
        this.serverConstants = serverConstants;

        this.lastAdded = _.get(_.last(users.organizationAccounts), 'name', null);

        this.organizations = _.map(_.keys(serverConstants.data.organizations), (key) => {
            return {id: key, val: serverConstants.data.organizations[key]};
        });
        this.reset();
    }
    connect() {
        this.connecting = true;
    }
    add() {
        this.api.post(`user/organization_accounts`, {
            username: this.username,
            password: this.password,
            organization_id: this.organization
        }).then(() => {
            this.connecting = false;
            //save stuff
            this.lastAdded = 'Insert Data here';
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