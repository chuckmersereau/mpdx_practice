class AccountListsController {
    constructor(
        accounts, api, users
    ) {
        this.accounts = accounts;
        this.api = api;
        this.users = users;

        this.showAllTags = false;
    }
}
const AccountLists = {
    controller: AccountListsController,
    template: require('./accountLists.html')
};

import accounts from 'common/accounts/accounts.service';
import api from 'common/api/api.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.menu.accountLists.component', [
    accounts, api, users
]).component('accountLists', AccountLists).name;
