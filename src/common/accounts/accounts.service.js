class AccountsService {
    api;

    constructor(api) {
        this.api = api;

        this.data = {};
        this.inviteList = null;
        this.userList = null;
    }
    load() {
        return this.api.get(`account_lists`).then((data) => {
            // console.log('accounts:', data.data);
            this.data = data.data;
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
