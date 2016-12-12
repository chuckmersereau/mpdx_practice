class MergesService {
    accounts;
    api;

    constructor(
        $rootScope, api, accounts
    ) {
        this.accounts = accounts;
        this.api = api;

        this.data = {};
        this.loading = true;
        this.selected_account_id = null;

        //this.load();

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        return this.api.get('preferences/accounts/merges').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    create() {
        return this.api.post('preferences/accounts/merges', { merge: { id: this.selected_account_id } }).then(() => {
            return this.accounts.load();
        });
    }
}

export default angular.module('mpdx.preferences.accounts.merge.service', [])
    .service('preferencesMerges', MergesService).name;
