class SharePreferencesController {
    accounts;
    alerts;
    users;

    constructor(accounts, alerts) {
        this.accounts = accounts;
        this.alerts = alerts;
        this.saving = false;
        this.inviteEmail = '';
        this.accounts.listUsers();
        this.accounts.listInvites();
    }
    cancelInvite(id) {
        this.saving = true;
        this.accounts.destroyInvite(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the invite successfully', 'info');
            this.accounts.listInvites();
        }).catch(() => {
            this.alerts.addAlert("MPDX couldn't remove the invite", 'danger');
            this.saving = false;
        });
    }
    removeUser(id) {
        this.saving = true;
        this.accounts.destroyUser(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the user successfully', 'info');
            this.accounts.listUsers();
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
