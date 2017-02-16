class ServerConstantsService {
    api;

    constructor(
        api,
        $log, $q
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;

        this.data = null;
    }
    load(reset = false) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }
        return this.api.get('constants').then((data) => {
            this.$log.debug('constants', data);
            this.data = data;
            return data;
        });
    }
}

export default angular.module('mpdx.common.serverConstants', [])
    .service('serverConstants', ServerConstantsService).name;
