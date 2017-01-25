class Session {
    api;
    fullsite;
    constructor(api) {
        this.api = api;

        this.alert = null;
        this.data = {};
        this.downloading = false;
        this.fullsite = true;
        this.fullScreen = false;
        this.notice = null;
    }
}

export default angular.module('mpdx.services.session', [])
    .service('session', Session).name;