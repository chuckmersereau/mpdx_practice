class SetupMergeController {
    constructor(
        $state,
        users
    ) {
        this.$state = $state;
        this.users = users;
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'merge';
        this.users.setOption(this.users.current.options.setup_position);
    }
    skip() {
        this.$state.go('setup.preferences');
    }
}

const SetupMerge = {
    template: require('./merge.html'),
    controller: SetupMergeController
};

export default angular.module('mpdx.setup.merge.component', [])
    .component('setupMerge', SetupMerge).name;