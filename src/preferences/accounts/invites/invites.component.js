class InvitePreferencesController {
    constructor(invitesService, alertsService) {
        this.preferences = invitesService;
        this.alerts = alertsService;
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        this.preferences.create(this.email, () => {
            this.saving = false;
            this.alerts.addAlert('MPDX sent an invite to ' + this.email, 'success');
            this.email = '';
            this.preferences.load();
        }, () => {
            this.alerts.addAlert("MPDX couldn't send an invite (check to see if email address is valid)", 'danger');
            this.saving = false;
        });
    };
}

const Invites = {
    controller: InvitePreferencesController,
    controllerAs: 'vm',
    template: require('./invites.html')
};
export default angular.module('mpdx.preferences.accounts.invites.component', [])
    .component('invitePreferences', Invites).name;
