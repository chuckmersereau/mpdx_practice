class CurrentAccountList {
    api;
    donations;

    constructor(
        $log, $rootScope,
        api
    ) {
        this.api = api;
        this.$log = $log;

        this.analytics = null;
        this.donations = {};

        $rootScope.$on('accountListUpdated', () => {
            this.get();
        });
    }
    get() {
        return this.api.get(`account_lists/${this.api.account_list_id}`).then((resp) => {
            _.extend(this, resp);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getTasks() {
        return this.api.get('tasks').then((resp) => {
            this.tasks = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getDonations() {
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`).then((resp) => {
            this.donations = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getAnalytics() {
        if (this.analytics) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get('accounts/analytics').then((data) => {
            this.analytics = data;
            return this.analytics;
        });
    }
}


export default angular.module('mpdx.common.currentAccountList', [])
    .service('currentAccountList', CurrentAccountList).name;
