class LoginController {
    constructor(
        $state, authManager
    ) {
        if (authManager.isAuthenticated()) {
            $state.go('home');
        }
        this.year = new Date().getFullYear();
        this.loginUrl = `${window.config.authUrl}${window.config.authLoginPath}`;
        this.signupUrl = `${window.config.authUrl}${window.config.authSignupPath}`;
    }
}

const Login = {
    controller: LoginController,
    template: require('./login.html')
};

export default angular.module('mpdx.common.login.component', [])
    .component('login', Login).name;
