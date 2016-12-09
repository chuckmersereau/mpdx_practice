class AccountsService {
    api;

    constructor(api) {
        this.api = api;

        this.data = {};
    }
    load() {
        return this.api.get(`account_lists`).then((data) => {
            console.log('accounts:', data.data);
            this.data = data.data;
            this.loading = false;
        });
    };
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accountsService', AccountsService).name;
