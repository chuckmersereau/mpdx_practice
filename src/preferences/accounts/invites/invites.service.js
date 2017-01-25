class InvitesService {
    api;

    constructor($rootScope, api) {
        this.api = api;

        this.data = {};
        this.loading = true;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        //this.load();
    }
    load() {
        this.loading = true;
        this.api.get('preferences/accounts/invites').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    destroy(id) {
        return this.api.delete('preferences/accounts/invites/' + id);
    }
    create(email) {
        return this.api.post('preferences/accounts/invites', { invite: { email: email } });
    }
}

export default angular.module('mpdx.preferences.accounts.invites.service', [])
    .service('invites', InvitesService).name;
