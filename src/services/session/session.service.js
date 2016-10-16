class Session {
    ticket
    constructor() {
        this.ticket = null;
    }
}

export default angular.module('mpdx.services.session', [])
    .service('session', Session).name;