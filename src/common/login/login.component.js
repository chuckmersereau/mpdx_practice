import config from 'config';

class LoginController {
    constructor(
        $state, authManager
    ) {
        if (authManager.isAuthenticated()) {
            $state.go('home');
        }
        this.year = new Date().getFullYear();
        this.loginUrl = `${config.authUrl}${config.authLoginPath}`;
    }
}

const Login = {
    controller: LoginController,
    template: require('./login.html')
};

export default angular.module('mpdx.common.login.component', [])
    .component('login', Login).name;
