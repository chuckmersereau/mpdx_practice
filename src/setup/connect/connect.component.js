class SetupConnectController {
    constructor(
        $state
    ) {
        this.$state = $state;

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
        this.$state.go('setup.somewhere');
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