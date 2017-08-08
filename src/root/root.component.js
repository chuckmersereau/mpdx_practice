class RootController {
    constructor(
        session
    ) {
        this.session = session;
    }
}
const Root = {
    template: require('./root.html'),
    controller: RootController
};

import session from 'common/session/session.service';

export default angular.module('mpdx.root.component', [
    session
]).component('root', Root).name;
