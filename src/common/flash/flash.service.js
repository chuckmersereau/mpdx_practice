class Flash {
    constructor(api, $log) {
        this.api = api;
        this.$log = $log;
    }
    get(id) {
        this.api.get('flash/' + id).then((resp) => {
            if (resp) {
                this[id] = resp;
            }
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
}

export default angular.module('mpdx.common.flash', [])
    .service('flash', Flash).name;
