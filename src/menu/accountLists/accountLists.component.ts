class AccountListsController {
    showAllTags: boolean;
    constructor(
        private accounts: AccountsService,
        private api: ApiService,
        private users: UsersService
    ) {
        this.showAllTags = false;
    }
}
const AccountLists = {
    controller: AccountListsController,
    template: require('./accountLists.html')
};

import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import api, { ApiService } from '../../common/api/api.service';
import users, { UsersService } from '../../common/users/users.service';

export default angular.module('mpdx.menu.accountLists.component', [
    accounts, api, users
]).component('accountLists', AccountLists).name;
