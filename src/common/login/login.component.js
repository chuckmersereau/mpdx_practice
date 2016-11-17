import config from 'config';

require('./login.scss');

class LoginController {
    constructor($state, $window, loginService) {
        if ($window.sessionStorage.token) {
            $state.go('home');
        }
        this.year = new Date().getFullYear();
        this.background = loginService.backgrounds[Math.floor(Math.random() * loginService.backgrounds.length)];
        this.loginUrl = config.theKeyUrl;
    }
}

const Login = {
    controller: LoginController,
    template: require('./login.html')
};

export default angular.module('mpdx.common.login.component', [])
    .component('login', Login).name;
