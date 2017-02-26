class DesignationAccountsService {
    api;
    data;

    constructor(
        $log, $q, $rootScope,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;

        this.data = [];
        this.loading = true;

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }
    load(reset = false) {
        this.loading = true;
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
        }
        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/designation_accounts`, data);
            this.data = data;
            this.loading = false;
            return this.data;
        });
    }
}

export default angular.module('mpdx.common.designationAccounts.service', [])
    .service('designationAccounts', DesignationAccountsService).name;