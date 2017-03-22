class InvitePreferencesController {
    accounts;
    alerts;
    invites;

    constructor(
        accounts, alerts, invites
    ) {
        this.accounts = accounts;
        this.invites = invites;
        this.alerts = alerts;
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        this.invites.create(this.email).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX sent an invite to ' + this.email, 'success');
            this.email = '';
            this.accounts.listInvites();
        }).catch(() => {
            this.alerts.addAlert("MPDX couldn't send an invite (check to see if email address is valid)", 'danger');
            this.saving = false;
        });
    };
}

const Invites = {
    controller: InvitePreferencesController,
    template: require('./invites.html')
};

export default angular.module('mpdx.preferences.accounts.invites.component', [])
    .component('invitePreferences', Invites).name;
