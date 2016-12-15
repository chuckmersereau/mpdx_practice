class SharePreferencesController {
    alerts;
    invites;
    users;

    constructor(invites, users, alerts) {
        this.invites = invites;
        this.users = users;
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
        this.users.destroy(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the user successfully', 'info');
            this.users.load();
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
