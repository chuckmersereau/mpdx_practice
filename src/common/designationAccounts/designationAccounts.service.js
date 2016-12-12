class DesignationAccountsService {
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
        this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`).then((data) => {
            while (this.data.length > 0) {
                this.data.pop();
            }
            Array.prototype.push.apply(this.data, data.data);
            this.loading = false;
        });
    }
}

export default angular.module('mpdx.common.designationAccounts.service', [])
    .service('designationAccounts', DesignationAccountsService).name;