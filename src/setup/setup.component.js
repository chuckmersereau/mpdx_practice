class SetupController {
}

const Setup = {
    template: require('./setup.html'),
    controller: SetupController
};

export default angular.module('mpdx.setup.component', [])
    .component('setup', Setup).name;