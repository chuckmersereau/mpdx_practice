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

        this.accounts.listUsers();
        this.accounts.listInvites();

        this.$rootScope.$on('accountListUpdated', () => {
            this.accounts.listInvites();
            this.accounts.listUsers();
        });
    }
    cancelInvite(id) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX removed the invite successfully');
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t remove the invite');
        return this.accounts.destroyInvite(id, successMessage, errorMessage).then(() => {
            this.saving = false;
            this.accounts.inviteList = reject({ id: id }, this.accounts.inviteList);
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    removeUser(id) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX removed the user successfully');
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t remove the user');
        return this.accounts.destroyUser(id, successMessage, errorMessage).then(() => {
            this.saving = false;
            this.accounts.userList = reject({ id: id }, this.accounts.userList);
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

export default angular.module('mpdx.preferences.accounts.share', [
    'gettext',
    accounts, users
]).component('sharePreferences', Share).name;
