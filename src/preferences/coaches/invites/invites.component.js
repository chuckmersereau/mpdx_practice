class InvitesController {
    constructor(
        gettextCatalog,
        accounts, alerts, coachesInvites
    ) {
        this.accounts = accounts;
        this.gettextCatalog = gettextCatalog;
        this.coachesInvites = coachesInvites;
        this.alerts = alerts;
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        return this.coachesInvites.create(this.email).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX sent an invite to {{email}}', { email: this.email }), 'success');
            this.email = '';
            return this.accounts.listCoachesInvites();
        }).catch((err) => {
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t send an invite (check to see if email address is valid)'), 'danger');
            this.saving = false;
            throw err;
        });
    }
}

const Invites = {
    controller: InvitesController,
    template: require('./invites.html')
};

import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import gettext from 'angular-gettext';
import coachesInvites from './invites.service';

export default angular.module('mpdx.preferences.coaches.invites.component', [
    gettext,
    accounts, alerts, coachesInvites
]).component('coachesInvitePreferences', Invites).name;
