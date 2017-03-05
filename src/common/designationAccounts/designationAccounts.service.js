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
        this.list = [];

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
            this.getList(true);
        });
    }

    load(reset = false) {
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
        }

        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/designation_accounts`, data);
            this.data = data;
            return this.data;
        });
    }

    getList(reset = false) {
        if (!reset && this.list.length > 0) {
            return this.$q.resolve(this.list);
        }

        const params = {
            fields: {designation_accounts: 'name,designation_number'},
            per_page: 10000
        };

        return this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`, params).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/designation_accounts`, data);
            this.list = data;
            return this.list;
        });
    }
}

export default angular.module('mpdx.common.designationAccounts.service', [])
    .service('designationAccounts', DesignationAccountsService).name;
