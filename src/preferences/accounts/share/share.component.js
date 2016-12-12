class SharePreferencesController {
    alertsService;
    users;

    constructor(accounts, alertsService) {
        this.accounts = accounts;
        this.alertsService = alertsService;
        this.saving = false;
        this.inviteEmail = '';
        this.accounts.listUsers();
        this.accounts.listInvites();
    }
    cancelInvite(id) {
        this.saving = true;
        this.accounts.destroyInvite(id).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed the invite successfully', 'info');
            this.accounts.listInvites();
        }).catch(() => {
            this.alertsService.addAlert("MPDX couldn't remove the invite", 'danger');
            this.saving = false;
        });
    }
    removeUser(id) {
        this.saving = true;
        this.accounts.destroyUser(id).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed the user successfully', 'info');
            this.accounts.listUsers();
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
