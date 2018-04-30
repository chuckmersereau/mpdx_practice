class InvitePreferencesController {
    email: string;
    saving: boolean;
    constructor(
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private invites: InvitesService
    ) {
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX sent an invite to {{email}}', { email: this.email });
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t send an invite (check to see if email address is valid)');
        return this.invites.create(this.email, successMessage, errorMessage).then(() => {
            this.saving = false;
            this.email = '';
            return this.accounts.listInvites();
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
}

const Invites = {
    controller: InvitePreferencesController,
    template: require('./invites.html')
};

import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import 'angular-gettext';
import invites, { InvitesService } from './invites.service';

export default angular.module('mpdx.preferences.accounts.invites.component', [
    'gettext',
    accounts, invites
]).component('invitePreferences', Invites).name;
