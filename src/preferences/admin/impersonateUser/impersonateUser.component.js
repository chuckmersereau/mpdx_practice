class ImpersonateUserController {
    constructor(
        $window,
        gettextCatalog,
        api, users
    ) {
        this.$window = $window;
        this.gettextCatalog = gettextCatalog;
        this.api = api;
        this.users = users;

        this.saving = false;
        this.impersonateUser = { user: '', reason: '' };
    }
    save() {
        this.saving = true;
        const errorMessage = this.gettextCatalog.getString('Unable to impersonate provided user');
        return this.api.post({
            url: 'admin/impersonation',
            data: this.impersonateUser,
            type: 'impersonation',
            errorMessage: errorMessage
        }).then((data) => {
            this.$window.localStorage.setItem('impersonatorToken', this.$window.localStorage.getItem('token'));
            this.$window.localStorage.setItem('impersonator', `${this.users.current.first_name} ${this.users.current.last_name}`);
            this.$window.localStorage.setItem('token', data.json_web_token);
            this.redirectHome();
        }).catch(() => {
            this.saving = false;
        });
    }
    redirectHome() {
        /* istanbul ignore next */
        this.$window.location.href = '/';
    }
}

const ImpersonateUser = {
    template: require('./impersonateUser.html'),
    controller: ImpersonateUserController
};

import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.admin.impersonateUser.component', [
    gettextCatalog,
    api, users
]).component('preferencesAdminImpersonateUser', ImpersonateUser).name;
