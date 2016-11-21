const Unavailable = {
    template: require('./unavailable.html')
};

export default angular.module('mpdx.unavailable.component', [])
    .component('unavailable', Unavailable).name;