import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';

class AccountController {
    accounts;
    users;
    constructor(
        $rootScope, $state,
        users, accounts
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.accounts = accounts;
        this.users = users;
    }
    $onInit() {
        const firstAccount = get('data[0].id', this.accounts);
        this.users.current.preferences.default_account_list = defaultTo(firstAccount, get('current.preferences.default_account_list', this.users));
        this.users.currentOptions.setup_position.value = 'account';
        this.users.setOption(this.users.currentOptions.setup_position);

        this.users.listOrganizationAccounts();
        this.$rootScope.$on('accountListUpdated', () => {
            this.users.listOrganizationAccounts(true);
        });
    }
    next() {
        return this.users.saveCurrent().then((data) => {
            return this.accounts.swap(data.preferences.default_account_list, this.users.current.id, true).then(() => {
                if (this.accounts.data.length > 1 && this.users.organizationAccounts.length > 1) {
                    this.$state.go('setup.preferences.accounts');
                } else {
                    this.$state.go('setup.preferences.personal');
                }
            });
        });
    }
}

import accounts from 'common/accounts/accounts.service';
import users from 'common/users/users.service';

const Account = {
    template: require('./account.html'),
    controller: AccountController
};

export default angular.module('mpdx.setup.account.component', [
    accounts, users
]).component('setupAccount', Account).name;
