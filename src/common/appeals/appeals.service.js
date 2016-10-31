class AppealsService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.appeals = [];
        this.loading = true;

        this.load();

        $rootScope.$watch(() => api.account_list_id, () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        this.api.get('appeals').then((data) => {
            while (this.appeals.length > 0) {
                this.appeals.pop();
            }
            Array.prototype.push.apply(this.appeals, data.appeals);
            this.loading = false;
        });
    }
}

export default angular.module('mpdx.common.appeals.service', [])
    .service('appealsService', AppealsService).name;
