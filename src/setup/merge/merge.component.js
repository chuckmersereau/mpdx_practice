class SetupMergeController {}

const SetupMerge = {
    template: require('./merge.html'),
    controller: SetupMergeController
};

export default angular.module('mpdx.setup.merge.component', [])
    .component('setupMerge', SetupMerge).name;