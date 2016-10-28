class Session {
    fullsite;
    constructor(api) {
        this.api = api;

        this.account_list_id = null;
        this.data = {};
        this.fullsite = true;
    }
    updateField(key, value, cb) {
        var body = {};
        body[key] = value;
        this.api.put('session', body).then(cb);
    }
}

export default angular.module('mpdx.services.session', [])
    .service('session', Session).name;