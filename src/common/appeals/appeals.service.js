class AppealsService {
    api;
    data;

    constructor(
        $rootScope, $q, $log,
        api
    ) {
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.$log = $log;
        this.api = api;

        this.list = [];

        this.$rootScope.$on('accountListUpdated', () => {
            this.getList(true);
        });
    }
    getAppeals() {
        return this.api.get('appeals').then((data) => {
            this.$log.debug(`appeals`, data);
            return data;
        });
    }
    getAppeal(appealId) {
        return this.api.get(`appeals/${appealId}`).then((data) => {
            this.$log.debug(`appeals/${appealId}`, data);
            return data;
        });
    }
    getList(reset = false) {
        if (!reset && this.list.length > 0) {
            return this.$q.resolve(this.list);
        }

        const params = {
            fields: {appeals: 'name'},
            filter: {account_list_id: this.api.account_list_id},
            per_page: 1000
        };

        return this.api.get('appeals', params).then((data) => {
            this.$log.debug(`appeals`, data);
            this.list = data;
            return this.list;
        });
    }
}

export default angular.module('mpdx.common.appeals.service', [])
    .service('appeals', AppealsService).name;
