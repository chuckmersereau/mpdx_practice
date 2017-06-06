import reject from 'lodash/fp/reject';

class SharePreferencesController {
    accounts;
    alerts;
    setup;
    users;

    constructor(
        $rootScope, gettextCatalog,
        accounts, alerts, users
    ) {
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.alerts = alerts;
        this.gettextCatalog = gettextCatalog;
        this.users = users;

        this.saving = false;
        this.inviteEmail = '';
    }
    $onInit() {
        if (this.setup) {
            return;
        }

        this.accounts.listUsers();
        this.accounts.listInvites();

        this.$rootScope.$on('accountListUpdated', () => {
            this.accounts.listInvites();
            this.accounts.listUsers();
        });
    }
    cancelInvite(id) {
        this.saving = true;
        return this.accounts.destroyInvite(id).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed the invite successfully'));
            this.accounts.inviteList = reject({id: id}, this.accounts.inviteList);
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString("MPDX couldn't remove the invite"), 'danger');
            this.saving = false;
            throw err;
        });
    }
    removeUser(id) {
        this.saving = true;
        return this.accounts.destroyUser(id).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed the user successfully'));
            this.accounts.userList = reject({id: id}, this.accounts.userList);
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString("MPDX couldn't remove the user"), 'danger');
            this.saving = false;
            throw err;
        });
    }
}

const Share = {
    controller: SharePreferencesController,
    template: require('./share.html'),
    bindings: {
        setup: '<'
    }
};


import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import gettext from 'angular-gettext';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.accounts.share', [
    gettext,
    accounts, alerts, users
]).component('sharePreferences', Share).name;
