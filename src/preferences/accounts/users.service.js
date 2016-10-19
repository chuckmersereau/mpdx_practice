class UsersService {
    constructor($rootScope, api) {
        this.api = api;

        this.data = {};
        this.loading = true;
        this.account_list_id_watcher = $rootScope.$watch(() => {
            return api.account_list_id;
        }, () => {
            this.load();
        });

        this.load();
    }
    load() {
        this.loading = true;
        this.api.get('preferences/accounts/users').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    destroy(id, success, error) {
        return this.api.delete('preferences/accounts/users/' + id).then(success).catch(error);
    }
}
export default angular.module('mpdx.preferences.accounts.usersService', [])
    .service('usersService', UsersService).name;

