const template = require('./impersonationBar.html');

class ImpersonationController {
    constructor(
        $window,
        users
    ) {
        this.$window = $window;
        this.users = users;
    }
    $onInit() {
        this.impersonator = this.$window.localStorage.getItem('impersonator');
        this.impersonated = `${this.users.current.first_name} ${this.users.current.last_name}`;
    }
    logout() {
        const token = this.$window.localStorage.getItem('impersonatorToken');
        this.$window.localStorage.setItem('token', token);
        this.$window.localStorage.removeItem('impersonator');
        this.$window.localStorage.removeItem('impersonatorToken');
        this.redirectHome();
    }
    redirectHome() {
        //untestable code
        this.$window.location.href = '/';
    }
}

const ImpersonationBar = {
    template: template,
    controller: ImpersonationController
};

import users from 'common/users/users.service';

export default angular.module('mpdx.menu.impersonationBar', [
    users
]).component('impersonationBar', ImpersonationBar).name;