class SetupController {
    constructor(session) {
        this.session = session;
    }
    $onInit() {
        this.session.navSetup = true;
    }
    $onDestroy() {
        this.session.navSetup = false;
    }
}

const Setup = {
    template: require('./setup.html'),
    controller: SetupController
};

import session from 'common/session/session.service';

export default angular.module('mpdx.setup.component', [
    session
]).component('setup', Setup).name;
