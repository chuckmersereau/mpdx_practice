class FinishController {
    constructor(
        $state,
        users
    ) {
        this.$state = $state;
        this.users = users;
    }
    $onInit() {
        this.users.currentOptions.setup_position.value = 'finish';
        this.users.setOption(this.users.currentOptions.setup_position);
    }
    next() {
        this.users.currentOptions.setup_position.value = '';
        this.users.setOption(this.users.currentOptions.setup_position).then(() => {
            this.$state.go('tools', { setup: true });
        });
    }
    dashboard() {
        this.users.currentOptions.setup_position.value = '';
        this.users.setOption(this.users.currentOptions.setup_position).then(() => {
            this.$state.go('home');
        });
    }
}

const Finish = {
    template: require('./finish.html'),
    controller: FinishController
};

export default angular.module('mpdx.setup.finish.component', [])
    .component('setupFinish', Finish).name;
