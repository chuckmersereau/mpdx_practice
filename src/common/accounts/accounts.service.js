class AccountsService {
    api;

    constructor($rootScope, api, $state) {
        this.api = api;

        this.data = {};
        this.loading = true;
        this.load();

        $rootScope.$on('accountListUpdated', () => {
            if (api.account_list_id) {
                let stateName = $state.current.name;
                if (!stateName) {
                    location.reload();
                }
            }
        });
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
