class SetupMergeController {
    constructor(
        $state
    ) {
        this.$state = $state;
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