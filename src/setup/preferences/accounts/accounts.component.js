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
        this.users.current.options.setup_position.value = 'preferences.accounts';
        this.users.setOption(this.users.current.options.setup_position);
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

export default angular.module('mpdx.setup.preferences.accounts.component', [])
    .component('setupPreferencesAccounts', Accounts).name;
