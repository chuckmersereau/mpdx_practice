import { defaultTo, get } from 'lodash/fp';
import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import setup, { SetupService } from '../setup.service';
import users, { UsersService } from '../../common/users/users.service';

class AccountController {
    constructor(
        private $rootScope: ng.IRootScopeService,
        private accounts: AccountsService,
        private setup: SetupService,
        private users: UsersService
    ) {}
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

export default angular.module('mpdx.setup.account.component', [
    accounts, setup, users
]).component('setupAccount', Account).name;
