class SetupStartController {
    users;
    constructor(
        $state,
        users
    ) {
        this.$state = $state;
        this.users = users;
    }
    $onInit() {
        console.log(this.users.current.options);
        // this.users.current.options.setup_position.value = 'start';
        // this.users.setOption(this.users.current.options.setup_position);
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


