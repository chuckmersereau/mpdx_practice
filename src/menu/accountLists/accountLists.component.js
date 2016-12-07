class AccountListsController {
    accountsService;
    api;

    constructor(
        accountsService, api
    ) {
        this.accountsService = accountsService;
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
