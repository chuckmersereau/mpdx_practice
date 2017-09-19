class AccountsController {
    constructor(
        $state,
        accounts,
        users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.users = users;

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

import accounts from 'common/accounts/accounts.service';
import uiRouter from '@uirouter/angularjs';
import users from 'common/users/users.service';

export default angular.module('mpdx.setup.preferences.accounts.component', [
    accounts, users,
    uiRouter
]).component('setupPreferencesAccounts', Accounts).name;
