class AccountsService {
    api;

    constructor($rootScope, api, $state, session) {
        this.api = api;

        this.data = {};
        this.loading = true;
        this.account_list_id = null;

        $rootScope.$watch(() => this.account_list_id, (accountListId) => {
            if (api.account_list_id) {
                var stateName = $state.current.name;
                session.updateField('current_account_list_id', this.account_list_id).then(() => {
                    if (!stateName) {
                        location.reload();
                    }
                });
            }
            api.account_list_id = accountListId;
        });
    }
    load() {
        this.loading = true;
        return this.api.get('preferences/accounts').then((data) => {
            this.data = data.preferences;
            this.account_list_id = data.preferences.account_list_id;
            this.loading = false;
        });
    };
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accountsService', AccountsService).name;
