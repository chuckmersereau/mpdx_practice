class MergeController {
}

const Merge = {
    controller: MergeController,
    template: require('./merge.html')
};

export default angular.module('mpdx.tools.merge.component', [])
    .component('merge', Merge).name;