class DesignationAccountsService {
    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.designationAccounts = [];
        this.loading = true;

        this.load();

        $rootScope.$watch(() => api.account_list_id, () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        this.api.get(`account_lists/${this.api.account_list_id}/designation_accounts`).then((data) => {
            while (this.designationAccounts.length > 0) {
                this.designationAccounts.pop();
            }
            Array.prototype.push.apply(this.designationAccounts, data.designation_accounts);
            this.loading = false;
        });
    }
}

export default angular.module('mpdx.common.designationAccounts.service', [])
    .service('designationAccountsService', DesignationAccountsService).name;