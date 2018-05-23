import 'angular-gettext';
import { reject } from 'lodash/fp';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import users, { UsersService } from '../../../common/users/users.service';

class SharePreferencesController {
    inviteEmail: string;
    saving: boolean;
    setup: boolean;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private users: UsersService
    ) {
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
        const successMessage = this.gettextCatalog.getString('MPDX removed the coaching invite successfully');
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t remove the coaching invite');
        return this.accounts.destroyInvite(id, successMessage, errorMessage).then(() => {
            this.saving = false;
            this.accounts.inviteCoachList = reject({ id: id }, this.accounts.inviteCoachList);
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    removeCoach(id) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX removed the coach successfully');
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t remove the coach');
        return this.accounts.destroyCoach(id, successMessage, errorMessage).then(() => {
            this.saving = false;
            this.accounts.coachList = reject({ id: id }, this.accounts.coachList);
        }).catch((err) => {
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

export default angular.module('mpdx.preferences.coaches.share', [
    'gettext',
    accounts, users
]).component('coachesSharePreferences', Share).name;
