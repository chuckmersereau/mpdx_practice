class AccountsService {
    api;

    constructor($rootScope, api, $state) {
        this.api = api;

        this.data = {};
        this.loading = true;
        this.account_list_id = null;
        this.load();

        $rootScope.$on('accountListUpdated', (accountListId) => {
            if (api.account_list_id) {
                let stateName = $state.current.name;
                if (!stateName) {
                    location.reload();
                }
            }
            api.account_list_id = accountListId;
        });
    }
    load() {
        this.loading = true;
        return this.api.get(`account_lists`).then((data) => {
            console.log(data);
            this.data = data.data;
            //this.account_list_id = data.preferences.account_list_id;
            this.loading = false;
        });
    };
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accountsService', AccountsService).name;
