import 'angular-gettext';
import { get } from 'lodash/fp';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import api, { ApiService } from '../../../common/api/api.service';
import users, { UsersService } from '../../../common/users/users.service';

class ImpersonateUserController {
    impersonateUser: any;
    saving: boolean;
    constructor(
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private alerts: AlertsService,
        private api: ApiService,
        private users: UsersService
    ) {
        this.saving = false;
        this.impersonateUser = { user: '', reason: '' };
    }
    save() {
        this.saving = true;

        return this.api.post({
            url: 'admin/impersonation',
            data: this.impersonateUser,
            type: 'impersonation',
            overridePromise: true
        }).then((data: any) => {
            this.$window.localStorage.setItem('impersonatorToken', this.$window.localStorage.getItem('token'));
            this.$window.localStorage.setItem('impersonator', `${this.users.current.first_name} ${this.users.current.last_name}`);
            this.$window.localStorage.setItem('token', data.json_web_token);
            this.redirectHome();
        }).catch((error) => {
            const errorMessage = get('status', error) === 404
                ? this.gettextCatalog.getString('Unable to find a user with provided credentials.')
                : this.gettextCatalog.getString('Unable to impersonate provided user');
            const errorLevel = get('status', error) === 404 ? 'warning' : 'danger';
            this.alerts.addAlert(errorMessage, errorLevel, 3);
            this.saving = false;
            throw error;
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

export default angular.module('mpdx.preferences.admin.impersonateUser.component', [
    'gettext',
    alerts, api, users
]).component('preferencesAdminImpersonateUser', ImpersonateUser).name;
