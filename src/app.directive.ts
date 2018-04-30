class AppController {
    year: number;
    constructor(
        private session: SessionService
    ) {
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

import session, { SessionService } from './common/session/session.service';

export default angular.module('mpdx.app', [session])
    .directive('app', App).name;