class LoginController {
    constructor($http, $window, $state) {
        this.$state = $state;
        this.$http = $http;
        this.$window = $window;

        this.user = {};
    }
    submit() {
        this.$http.post('/authenticate', this.user).then((data) => {
            this.$window.sessionStorage.token = data.token;
            this.$state.go('home');
        }).catch(() => {
            delete this.$window.sessionStorage.token;
        });
    }
}
const Login = {
    template: require('./login.html'),
    controller: LoginController
};

export default angular.module('mpdx.login', [])
    .component('login', Login)
    .name;