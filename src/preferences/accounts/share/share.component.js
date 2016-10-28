class SharePreferencesController {
    alertsService;
    invitesService;
    usersService;

    constructor(invitesService, usersService, alertsService, gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
        this.invitesService = invitesService;
        this.usersService = usersService;
        this.alertsService = alertsService;
        this.saving = false;
        this.inviteEmail = '';
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
        this.usersService.destroy(id).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed the user successfully', 'info');
            this.usersService.load();
        }).catch(() => {
            this.alertsService.addAlert("MPDX couldn't remove the user", 'danger');
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
