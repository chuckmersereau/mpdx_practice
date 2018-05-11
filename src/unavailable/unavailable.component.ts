const Unavailable: ng.IComponentOptions = {
    template: require('./unavailable.html')
};

export default angular.module('mpdx.unavailable.component', [])
    .component('unavailable', Unavailable).name;