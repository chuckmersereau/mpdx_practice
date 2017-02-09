class SetupStartController {
    users;
    constructor(
        $state,
        users
    ) {
        this.$state = $state;
        this.users = users;
    }
    begin() {
        this.users.saveCurrent().then(() => {
            this.$state.go('setup.connect');
        });
    }
}

const SetupStart = {
    template: require('./start.html'),
    controller: SetupStartController
};

export default angular.module('mpdx.setup.start.component', [])
    .component('setupStart', SetupStart).name;


