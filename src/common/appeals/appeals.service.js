class AppealsService {
    api;
    data;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.data = [];
        this.loading = true;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        this.api.get('appeals').then((data) => {
            while (this.data.length > 0) {
                this.data.pop();
            }
            Array.prototype.push.apply(this.data, data.appeals);
            this.loading = false;
        });
    }
}

export default angular.module('mpdx.common.appeals.service', [])
    .service('appeals', AppealsService).name;
