const Appeals: ng.IComponentOptions = {
    template: require('./appeals.html')
};

export default angular.module('mpdx.tools.appeals.component', [])
    .component('appeals', Appeals).name;
