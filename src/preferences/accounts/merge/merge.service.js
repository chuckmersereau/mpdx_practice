class MergesService {
    accountsService;
    api;

    constructor(
        $rootScope, api, accountsService
    ) {
        this.accountsService = accountsService;
        this.api = api;

        this.data = {};
        this.loading = true;
        this.selected_account_id = null;

        this.load();

        this.account_list_id_watcher = $rootScope.$watch(() => api.account_list_id, () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        this.api.get('preferences/accounts/merges').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    create(success, error) {
        return this.api.post('preferences/accounts/merges', { merge: { id: this.selected_account_id } }).then(() => {
            this.accountsService.load();
            success();
        }).catch(error);
    }
}

export default angular.module('mpdx.preferences.accounts.merge.service', [])
    .service('mergesService', MergesService).name;
