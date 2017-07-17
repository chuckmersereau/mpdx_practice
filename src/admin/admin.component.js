const template = require('./admin.html');

class AdminController {
    constructor(
        $log, $window,
        alerts, api, users
    ) {
        this.$log = $log;
        this.$window = $window;
        this.alerts = alerts;
        this.api = api;
        this.users = users;
        this.loading = false;
    }
    impersonate(form) {
        this.loading = true;
        return this.api.post({
            url: 'admin/impersonation',
            data: {
                user: form.userId,
                reason: form.reason
            },
            type: 'impersonation'
        }).then(data => {
            this.$log.debug('impersonate', data);
            const originalToken = this.$window.localStorage.getItem('token');
            this.$window.localStorage.setItem('impersonatorToken', originalToken);
            this.$window.localStorage.setItem('impersonator', `${this.users.current.first_name} ${this.users.current.last_name}`);
            this.$window.localStorage.setItem('token', data.json_web_token);
            this.redirectHome();
        }).catch(() => {
            this.loading = false;
            this.alerts.addAlert('Unable to impersonate provided user id', 'danger');
        });
    }
    redirectHome() {
        //untestable code
        this.$window.location.href = '/';
    }
}

const Admin = {
    template: template,
    controller: AdminController
};

import api from 'common/api/api.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.admin', [
    api, users
]).component('admin', Admin).name;