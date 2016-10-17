class Flash {
    constructor(api, $log) {
        this.api = api;
        this.$log = $log;
    }
    get(id) {
        this.api.get('flash/' + id).then((resp) => {
            if (resp.data) {
                this[id] = resp.data;
            }
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
}

export default angular.module('mpdx.services.flash', [])
    .service('flash', Flash).name;
