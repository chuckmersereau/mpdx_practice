class AccountsService {
    api;

    constructor(api) {
        this.api = api;

        this.data = {};
        this.loading = true;
        this.load();
    }
    load() {
        this.loading = true;
        return this.api.get(`account_lists`).then((data) => {
            this.data = data.data;
            this.loading = false;
        });
    };
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accountsService', AccountsService).name;
