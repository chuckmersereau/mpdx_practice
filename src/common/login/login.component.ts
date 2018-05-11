import { StateService } from '@uirouter/core';
import config from '../../config';

class LoginController {
    loginUrl: string;
    signupUrl: string;
    year: number;
    constructor(
        $state: StateService,
        authManager: any
    ) {
        if (authManager.isAuthenticated()) {
            $state.go('home');
        }
        this.year = new Date().getFullYear();
        this.loginUrl = `${config.authUrl}${config.authLoginPath}`;
        this.signupUrl = `${config.authUrl}${config.authSignupPath}`;
    }
}

const Login = {
    controller: LoginController,
    template: require('./login.html')
};

export default angular.module('mpdx.common.login.component', [])
    .component('login', Login).name;
