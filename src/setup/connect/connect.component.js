class SetupConnectController {
    accounts;
    constructor(
        $state,
        accounts
    ) {
        this.$state = $state;
        this.accounts = accounts;

        this.lastAdded = null;
        this.reset();
    }
    connect() {
        this.connecting = true;
    }
    add() {
        this.connecting = false;
        //save stuff
        this.lastAdded = 'Insert Data here';
    }
    next() {
        if (this.accounts.data.length > 1) {
            this.$state.go('setup.merge');
        } else {
            this.$state.go('setup.somewhereelse');
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