class StartController {
    users;
    constructor(
        $state,
        users
    ) {
        this.$state = $state;
        this.users = users;
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'start';
        this.users.setOption(this.users.current.options.setup_position);
    }
    next() {
        this.$state.go('setup.connect');
    }
}

const Start = {
    template: require('./start.html'),
    controller: StartController
};

export default angular.module('mpdx.setup.start.component', [])
    .component('setupStart', Start).name;
