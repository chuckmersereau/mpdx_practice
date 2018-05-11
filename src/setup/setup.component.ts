import session, { SessionService } from '../common/session/session.service';

class SetupController {
    constructor(
        private session: SessionService
    ) {}
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

export default angular.module('mpdx.setup.component', [
    session
]).component('setup', Setup).name;
