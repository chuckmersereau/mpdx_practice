class DesignationAccountsService {
    api;
    data;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.data = [];
        this.loading = true;

        this.load();

        $rootScope.$watch(() => api.account_list_id, () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        this.api.get('designation_accounts').then((data) => {
            while (this.data.length > 0) {
                this.data.pop();
            }
            Array.prototype.push.apply(this.data, data.designation_accounts);
            this.loading = false;
        });
    }
}

export default angular.module('mpdx.common.designationAccounts.service', [])
    .service('designationAccounts', DesignationAccountsService).name;