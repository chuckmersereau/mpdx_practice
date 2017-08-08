class AppController {
    constructor(session) {
        this.session = session;
        this.year = new Date().getFullYear();
    }
}

function App() {
    return {
        restrict: 'A',
        controller: AppController,
        controllerAs: '$ctrl'
    };
}

import session from './common/session/session.service';
export default angular.module('mpdx.app', [session])
    .directive('app', App).name;