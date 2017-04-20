import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';

class AccountController {
    accounts;
    users;
    constructor(
        $state,
        users, accounts
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.users = users;
    }
    $onInit() {
        const firstAccount = get('data[0].id', this.accounts);
        this.users.current.preferences.default_account_list = defaultTo(firstAccount, this.users.current.preferences.default_account_list);
        this.users.currentOptions.setup_position.value = 'account';
        this.users.setOption(this.users.currentOptions.setup_position);
    }
    next() {
        return this.users.saveCurrent().then((data) => {
            return this.accounts.swap(data.preferences.default_account_list, this.users.current.id, true).then(() => {
                //disabled for now
                // if (this.accounts.data.length > 1) {
                //     this.$state.go('setup.preferences.accounts');
                // } else {
                this.$state.go('setup.preferences.personal');
                // }
            });
        });
    }
}

const Account = {
    template: require('./account.html'),
    controller: AccountController
};

export default angular.module('mpdx.setup.account.component', [])
    .component('setupAccount', Account).name;
