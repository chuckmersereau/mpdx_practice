class Session {
    fullsite;
    constructor() {
        this.fullsite = true;
    }
}

export default angular.module('mpdx.services.session', [])
    .service('session', Session).name;