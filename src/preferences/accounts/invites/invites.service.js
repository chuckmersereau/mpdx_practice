class InvitesService {
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
        this.api.get('preferences/accounts/invites').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    destroy(id, success, error) {
        return this.api.delete('preferences/accounts/invites/' + id).then(success).catch(error);
    }
    create(email, success, error) {
        return this.api.post('preferences/accounts/invites', { invite: { email: email } }).then(success).catch(error);
    }
}

export default angular.module('mpdx.preferences.accounts.invites.service', [])
    .service('invitesService', InvitesService).name;
