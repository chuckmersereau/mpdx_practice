class InvitesService {
    constructor(
        api
    ) {
        this.api = api;
    }
    create(email) {
        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/invites`,
            data: { recipient_email: email, invite_user_as: 'coach' },
            type: 'account_list_invites'
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.preferences.coaches.invites.service', [
    api
]).service('coachesInvites', InvitesService).name;
