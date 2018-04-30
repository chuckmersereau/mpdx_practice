class InvitesController {
    email: string;
    saving: boolean;
    constructor(
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private api: ApiService
    ) {
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX sent an invite to {{email}}', { email: this.email });
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t send an invite (check to see if email address is valid)');
        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/invites`,
            data: { recipient_email: this.email, invite_user_as: 'coach' },
            type: 'account_list_invites',
            successMessage: successMessage,
            errorMessage: errorMessage
        }).then(() => {
            this.saving = false;
            this.email = '';
            return this.accounts.listCoachesInvites();
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
}

const Invites = {
    controller: InvitesController,
    template: require('./invites.html')
};

import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import 'angular-gettext';
import api, { ApiService } from '../../../common/api/api.service';

export default angular.module('mpdx.preferences.coaches.invites.component', [
    'gettext',
    accounts, api
]).component('coachesInvitePreferences', Invites).name;
