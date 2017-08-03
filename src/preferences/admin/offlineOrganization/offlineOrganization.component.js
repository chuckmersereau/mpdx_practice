class OfflineOrganizationController {
    constructor(
        gettextCatalog,
        alerts, api
    ) {
        this.gettextCatalog = gettextCatalog;
        this.alerts = alerts;
        this.api = api;
        this.saving = false;
        this.offlineOrganization = { name: '', org_help_url: '', country: '' };
    }
    save() {
        this.saving = true;
        return this.api.post({
            url: 'admin/organizations',
            data: this.offlineOrganization,
            type: 'organizations'
        }).then(() => {
            this.saving = false;
            this.offlineOrganization = { name: '', org_help_url: '', country: '' };
            this.alerts.addAlert(this.gettextCatalog.getString('Successfully created offline organization'), 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to create offline organization'), 'danger');
        });
    }
}

const OfflineOrganization = {
    template: require('./offlineOrganization.html'),
    controller: OfflineOrganizationController
};

import gettextCatalog from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';

export default angular.module('mpdx.preferences.admin.offlineOrganization.component', [
    gettextCatalog,
    alerts, api
]).component('preferencesAdminOfflineOrganization', OfflineOrganization).name;
