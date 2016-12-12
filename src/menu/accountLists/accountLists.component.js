class AccountListsController {
    accounts;
    api;

    constructor(
        accounts, api
    ) {
        this.accounts = accounts;
        this.api = api;

        this.showAllTags = false;
    }
}
const AccountLists = {
    controller: AccountListsController,
    template: require('./accountLists.html')
};

export default angular.module('mpdx.menu.accountLists.component', [])
    .component('accountLists', AccountLists).name;
