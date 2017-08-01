const Merge = {
    template: require('./merge.html')
};

export default angular.module('mpdx.tools.merge.component', [])
    .component('merge', Merge).name;