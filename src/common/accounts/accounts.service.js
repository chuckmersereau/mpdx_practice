class AccountsService {
    api;
    donations;

    constructor(
        $rootScope, $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.current = null;
        this.data = {};
        this.donations = null;
        this.inviteList = null;
        this.userList = null;

        $rootScope.$on('accountListUpdated', () => {
            this.getCurrent();
        });
    }
    load() {
        return this.api.get(`account_lists`).then((data) => {
            // console.log('accounts:', data.data);
            this.data = data;
        });
    }
    getCurrent() {
        return this.api.get(`account_lists/${this.api.account_list_id}`).then((resp) => {
            // console.log('accounts/current', resp);
            this.current = resp.data;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getDonations() {
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`).then((resp) => {
            this.donations = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    destroyInvite(id) {
        return this.api.delete(`account_lists/${this.api.account_list_id}/invites/${id}`);
    }
    destroyUser(id) {
        return this.api.delete(`account_lists/${this.api.account_list_id}/users/${id}`);
    }
    listInvites() {
        this.inviteList = null;
        return this.api.get(`account_lists/${this.api.account_list_id}/invites`).then((data) => {
            this.inviteList = data.data;
            console.log('inviteList', this.inviteList);
        });
    }
    listUsers() {
        this.userList = null;
        this.api.get(`account_lists/${this.api.account_list_id}/users`).then((data) => {
            this.userList = data.data;
            console.log('userList', this.userList);
        });
    }
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accounts', AccountsService).name;
