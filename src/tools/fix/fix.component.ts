const Fix: ng.IComponentOptions = {
    template: require('./fix.html')
};

export default angular.module('mpdx.tools.fix.component', [])
    .component('fix', Fix).name;
