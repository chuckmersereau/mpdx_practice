class UnavailableController {
}

const Unavailable = {
    template: require('./unavailable.html'),
    controller: UnavailableController
};

export default angular.module('mpdx.unavailable.component', [])
    .component('unavailable', Unavailable).name;