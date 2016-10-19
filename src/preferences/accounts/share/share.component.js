class SharePreferencesController {
    alerts;

    constructor(invitesService, usersService, alertsService, gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
        this.invitePreferences = invitesService;
        this.userPreferences = usersService;
        this.alerts = alertsService;
        this.saving = false;
        this.inviteEmail = '';
    }
    cancelInvite(id) {
        this.saving = true;
        this.invitePreferences.destroy(id, () => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the invite successfully', 'info');
            this.invitePreferences.load();
        }, () => {
            this.alerts.addAlert("MPDX couldn't remove the invite", 'danger');
            this.saving = false;
        });
    }
    removeUser(id) {
        this.saving = true;
        this.userPreferences.destroy(id, () => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the user successfully', 'info');
            this.userPreferences.load();
        }, () => {
            this.alerts.addAlert("MPDX couldn't remove the user", 'danger');
            this.saving = false;
        });
    }
}

const Share = {
    controller: SharePreferencesController,
    controllerAs: 'vm',
    template: require('./share.html')
};

export default angular.module('mpdx.preferences.accounts.share', [])
    .component('sharePreferences', Share).name;
