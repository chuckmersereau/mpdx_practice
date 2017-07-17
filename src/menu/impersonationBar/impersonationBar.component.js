const template = require('./impersonationBar.html');

class ImpersonationController {
    constructor(
        $timeout, $window,
        users
    ) {
        this.$timeout = $timeout;
        this.$window = $window;
        this.users = users;

        this.loading = false;
    }
    $onInit() {
        this.$timeout(() => {
            this.impersonator = this.$window.localStorage.getItem('impersonator');
            this.impersonated = `${this.users.current.first_name} ${this.users.current.last_name}`;
        }, 500);
    }
    logout() {
        this.loading = true;
        if (this.impersonator) {
            const token = this.$window.localStorage.getItem('impersonatorToken');
            this.$window.localStorage.setItem('token', token);
            this.$window.localStorage.removeItem('impersonator');
            this.$window.localStorage.removeItem('impersonatorToken');
            this.redirectHome();
        } else {
            this.redirectHome();
        }
        this.impersonator = null;
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