import isNilOrEmpty from '../../common/fp/isNilOrEmpty';

const template = require('./impersonationBar.html');

class ImpersonationController {
    impersonated: string;
    impersonator: string;
    loading: boolean;
    constructor(
        private $timeout: ng.ITimeoutService,
        private $window: ng.IWindowService,
        private session: SessionService,
        private users: UsersService
    ) {
        this.loading = false;
    }
    $onInit() {
        this.$timeout(() => {
            this.impersonator = this.$window.localStorage.getItem('impersonator');
            this.impersonated = isNilOrEmpty(this.impersonator)
                ? null
                : `${this.users.current.first_name} ${this.users.current.last_name}`;
            this.session.navImpersonation = !!this.impersonator;
        }, 500);
    }
    logout() {
        this.loading = true;
        const token = this.$window.localStorage.getItem('impersonatorToken');
        if (this.impersonator && token) {
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
        // untestable code
        this.$window.location.href = '/';
    }
}

const ImpersonationBar = {
    template: template,
    controller: ImpersonationController
};

import users, { UsersService } from '../../common/users/users.service';
import session, { SessionService } from '../../common/session/session.service';

export default angular.module('mpdx.menu.impersonationBar', [
    session, users
]).component('impersonationBar', ImpersonationBar).name;
