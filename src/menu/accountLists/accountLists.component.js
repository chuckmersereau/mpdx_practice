class AccountListsController {
    accounts;
    api;
    users;

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

export default angular.module('mpdx.menu.accountLists.component', [])
    .component('accountLists', AccountLists).name;
