class ResetAccountController {
    constructor(
        gettextCatalog,
        alerts, api
    ) {
        this.gettextCatalog = gettextCatalog;
        this.alerts = alerts;
        this.api = api;
        this.saving = false;
        this.resetAccount = { resetted_user_email: '', reason: '', account_list_name: '' };
    }
    save() {
        this.saving = true;
        return this.api.post({
            url: 'admin/resets',
            data: this.resetAccount,
            type: 'resets'
        }).then(() => {
            this.saving = false;
            this.resetAccount = { resetted_user_email: '', reason: '', account_list_name: '' };
            this.alerts.addAlert(this.gettextCatalog.getString('Successfully reset account'), 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to reset account'), 'danger');
        });
    }
}

const ResetAccount = {
    template: require('./resetAccount.html'),
    controller: ResetAccountController
};

import gettextCatalog from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';

export default angular.module('mpdx.preferences.admin.resetAccount.component', [
    gettextCatalog,
    alerts, api
]).component('preferencesAdminResetAccount', ResetAccount).name;
