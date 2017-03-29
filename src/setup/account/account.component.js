import get from 'lodash/fp/get';

class AccountController {
    accountListId;
    constructor(
        $state,
        users, accounts
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.users = users;

        this.accountListId = get('current.preferences.default_account_list', this.users);
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'account';
        this.users.setOption(this.users.current.options.setup_position);
    }
    next() {
        return this.accounts.swap(this.accountListId, this.users.current.id, true).then(() => {
            this.$state.go('setup.preferences.accounts');
        });
    }
}

const Account = {
    template: require('./account.html'),
    controller: AccountController
};

export default angular.module('mpdx.setup.account.component', [])
    .component('setupAccount', Account).name;
