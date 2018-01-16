import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';

class AccountController {
    constructor(
        $rootScope,
        accounts, setup, users
    ) {
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.setup = setup;
        this.users = users;
    }
    $onInit() {
        const firstAccount = get('data[0].id', this.accounts);
        this.users.current.preferences.default_account_list = defaultTo(firstAccount, get('current.preferences.default_account_list', this.users));
        this.users.listOrganizationAccounts();
        this.$rootScope.$on('accountListUpdated', () => {
            this.users.listOrganizationAccounts(true);
        });
    }
    next() {
        return this.users.saveCurrent().then(() => {
            return this.accounts.swap(
                this.users.current.preferences.default_account_list,
                this.users.current.id,
                true
            ).then(() => {
                this.setup.next();
            });
        });
    }
}

const Account = {
    template: require('./account.html'),
    controller: AccountController
};

import accounts from 'common/accounts/accounts.service';
import setup from 'setup/setup.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.setup.account.component', [
    accounts, setup, users
]).component('setupAccount', Account).name;
