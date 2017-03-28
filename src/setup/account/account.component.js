class AccountController {
    constructor(
        $rootScope, $state
    ) {
        $rootScope.$on('accountListUpdated', () => {
            $state.go('home');
        });
    }
}

const Account = {
    template: require('./account.html'),
    controller: AccountController
};

export default angular.module('mpdx.setup.account.component', [])
    .component('setupAccount', Account).name;