import { StateService } from '@uirouter/core';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import uiRouter from '@uirouter/angularjs';
import users, { UsersService } from '../../../common/users/users.service';

class AccountsController {
    selectedTab: string;
    constructor(
        private $state: StateService,
        private accounts: AccountsService,
        private users: UsersService
    ) {
        this.selectedTab = 'merge_account';
    }
    $onInit() {
        this.users.currentOptions.setup_position.value = 'preferences.accounts';
        this.users.setOption(this.users.currentOptions.setup_position);
    }
    onSave() {
        this.next();
    }
    next() {
        this.$state.go('setup.preferences.personal');
    }
}

const Accounts = {
    template: require('./accounts.html'),
    controller: AccountsController
};

export default angular.module('mpdx.setup.preferences.accounts.component', [
    accounts, users,
    uiRouter
]).component('setupPreferencesAccounts', Accounts).name;
