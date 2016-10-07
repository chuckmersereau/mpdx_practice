class LoginController {
    constructor() {
        this.welcomeMessage = 'Hello World';
    }
}
const Login = {
    template: require('./login.html'),
    controller: LoginController
};

export default angular.module('mpdx.login', [])
    .component('login', Login)
    .name;