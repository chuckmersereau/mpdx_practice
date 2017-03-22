class InvitesService {
    api;

    constructor(
        api
    ) {
        this.api = api;
    }
    destroy(id) {
        return this.api.delete(`account_lists/${this.api.account_list_id}/invites/${id}`);
    }
    create(email) {
        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/invites`,
            data: { recipient_email: email },
            type: 'account_list_invites'
        });
    }
}

export default angular.module('mpdx.preferences.accounts.invites.service', [])
    .service('invites', InvitesService).name;
