class InvitePreferencesController {
    accounts;
    alerts;
    invites;

    constructor(
        gettextCatalog,
        accounts, alerts, invites
    ) {
        this.accounts = accounts;
        this.gettextCatalog = gettextCatalog;
        this.invites = invites;
        this.alerts = alerts;
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        return this.invites.create(this.email).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX sent an invite to {{email}}', {email: this.email}), 'success');
            this.email = '';
            return this.accounts.listInvites();
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString("MPDX couldn't send an invite (check to see if email address is valid)"), 'danger');
            this.saving = false;
            throw err;
        });
    };
}

const Invites = {
    controller: InvitePreferencesController,
    template: require('./invites.html')
};

import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import gettext from 'angular-gettext';
import invites from './invites.service';

export default angular.module('mpdx.preferences.accounts.invites.component', [
    gettext,
    accounts, alerts, invites
]).component('invitePreferences', Invites).name;
