import reject from 'lodash/fp/reject';

class SharePreferencesController {
    accounts;
    alerts;
    users;

    constructor(
        $rootScope,
        accounts, alerts, users
    ) {
        this.accounts = accounts;
        this.alerts = alerts;
        this.users = users;

        this.saving = false;
        this.inviteEmail = '';
        this.accounts.listUsers();
        this.accounts.listInvites();

        $rootScope.$on('accountListUpdated', () => {
            this.accounts.listInvites();
            this.accounts.listUsers();
        });
    }
    cancelInvite(id) {
        this.saving = true;
        this.accounts.destroyInvite(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the invite successfully');
            this.accounts.inviteList = reject({id: id}, this.accounts.inviteList);
        }).catch(() => {
            this.alerts.addAlert("MPDX couldn't remove the invite", 'danger');
            this.saving = false;
        });
    }
    removeUser(id) {
        this.saving = true;
        this.accounts.destroyUser(id).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed the user successfully');
            this.accounts.userList = reject({id: id}, this.accounts.userList);
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
