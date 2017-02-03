class SetupConnectController {
}

const SetupConnect = {
    template: require('./connect.html'),
    controller: SetupConnectController
};

export default angular.module('mpdx.setup.connect.component', [])
    .component('setupConnect', SetupConnect).name;