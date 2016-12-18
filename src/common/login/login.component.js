import config from 'config';

require('./login.scss');

class LoginController {
    constructor($state, $window, login) {
        if ($window.sessionStorage.token) {
            $state.go('home');
        }
        this.year = new Date().getFullYear();
        this.background = login.backgrounds[Math.floor(Math.random() * login.backgrounds.length)];
        this.loginUrl = config.theKeyUrl;
    }
}

const Login = {
    controller: LoginController,
    template: require('./login.html')
};

export default angular.module('mpdx.common.login.component', [])
    .component('login', Login).name;
