class SharePreferencesController {
    alertsService;
    invitesService;
    users;

    constructor(invitesService, users, alertsService) {
        this.invitesService = invitesService;
        this.users = users;
        this.alertsService = alertsService;
        this.saving = false;
        this.inviteEmail = '';
        this.users.listForCurrentAccount();
    }
    cancelInvite(id) {
        this.saving = true;
        this.invitesService.destroy(id).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed the invite successfully', 'info');
            this.invitesService.load();
        }).catch(() => {
            this.alertsService.addAlert("MPDX couldn't remove the invite", 'danger');
            this.saving = false;
        });
    }
    removeUser(id) {
        this.saving = true;
        this.users.destroy(id).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed the user successfully', 'info');
            this.users.listForCurrentAccount();
        }).catch(() => {
            this.alertsService.addAlert("MPDX couldn't remove the user", 'danger');
            this.saving = false;
        });
    }
}

const Share = {
    controller: SharePreferencesController,
    template: require('./share.html')
};

export default angular.module('mpdx.preferences.accounts.share', [])
    .component('sharePreferences', Share).name;
