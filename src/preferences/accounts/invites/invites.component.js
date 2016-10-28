class InvitePreferencesController {
    constructor(invitesService, alertsService) {
        this.invitesService = invitesService;
        this.alertsService = alertsService;
        this.saving = false;
        this.email = '';
    }
    sendInvite() {
        this.saving = true;
        this.invitesService.create(this.email).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX sent an invite to ' + this.email, 'success');
            this.email = '';
            this.invitesService.load();
        }).catch(() => {
            this.alertsService.addAlert("MPDX couldn't send an invite (check to see if email address is valid)", 'danger');
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
