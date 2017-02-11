class SetupMergeController {
    constructor(
        $state,
        users
    ) {
        this.$state = $state;

        users.current.options.setup_position.value = 'merge';
        users.setOption(users.current.options.setup_position);
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