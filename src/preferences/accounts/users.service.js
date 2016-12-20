class UsersService {
    constructor($rootScope, api) {
        this.api = api;

        this.data = {};
        this.loading = true;

        $rootScope.$watch(() => api.account_list_id, () => {
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
    destroy(id) {
        return this.api.delete('preferences/accounts/users/' + id);
    }
}
export default angular.module('mpdx.preferences.accounts.usersService', [])
    .service('users', UsersService).name;

