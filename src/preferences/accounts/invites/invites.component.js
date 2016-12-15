class InvitePreferencesController {
    alerts;
    invitesService;

    constructor(invitesService, alerts) {
        this.invitesService = invitesService;
        this.alerts = alerts;
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        this.invitesService.create(this.email).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX sent an invite to ' + this.email, 'success');
            this.email = '';
            this.invitesService.load();
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
