class Session {
    api;
    fullsite;
    constructor(api) {
        this.api = api;

        this.account_list_id = null;
        this.data = {};
        this.fullsite = true;
    }
    updateField(key, value) {
        let body = {};
        body[key] = value;
        return this.api.put('session', body);
    }
}

export default angular.module('mpdx.services.session', [])
    .service('session', Session).name;