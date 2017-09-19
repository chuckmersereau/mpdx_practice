import reject from 'lodash/fp/reject';

class SharePreferencesController {
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

        this.accounts.listCoaches();
        this.accounts.listCoachesInvites();

        this.$rootScope.$on('accountListUpdated', () => {
            this.accounts.listCoaches();
            this.accounts.listCoachesInvites();
        });
    }
    removeCoachInvite(id) {
        this.saving = true;
        return this.accounts.destroyInvite(id).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed the coaching invite successfully'));
            this.accounts.inviteCoachList = reject({ id: id }, this.accounts.inviteCoachList);
        }).catch((err) => {
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t remove the coaching invite'), 'danger');
            this.saving = false;
            throw err;
        });
    }
    removeCoach(id) {
        this.saving = true;
        return this.accounts.destroyCoach(id).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed the coach successfully'));
            this.accounts.coachList = reject({ id: id }, this.accounts.coachList);
        }).catch((err) => {
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX couldn\'t remove the coach'), 'danger');
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

export default angular.module('mpdx.preferences.coaches.share', [
    gettext,
    accounts, alerts, users
]).component('coachesSharePreferences', Share).name;
