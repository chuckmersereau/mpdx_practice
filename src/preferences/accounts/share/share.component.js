class SharePreferencesController {
    alerts;
    invites;
    usersService;

    constructor(invites, usersService, alerts) {
        this.invites = invites;
        this.usersService = usersService;
        this.alerts = alerts;
        this.saving = false;
        this.inviteEmail = '';
    }
    cancelInvite(id) {
        this.saving = true;
        this.invites.destroy(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the invite successfully', 'info');
            this.invites.load();
        }).catch(() => {
            this.alerts.addAlert("MPDX couldn't remove the invite", 'danger');
            this.saving = false;
        });
    }
    removeUser(id) {
        this.saving = true;
        this.usersService.destroy(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the user successfully', 'info');
            this.usersService.load();
        }).catch(() => {
            this.alerts.addAlert("MPDX couldn't remove the user", 'danger');
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
