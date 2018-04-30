import { isFunction } from 'lodash/fp';

class OfflineOrganizationController {
    offlineOrganization: any;
    saving: boolean;
    constructor(
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService
    ) {
        this.saving = false;
        this.offlineOrganization = { name: '', org_help_url: '', country: '' };
    }
    save(form) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('Successfully created offline organization');
        const errorMessage = this.gettextCatalog.getString('Unable to create offline organization');
        return this.api.post({
            url: 'admin/organizations',
            data: this.offlineOrganization,
            type: 'organizations',
            successMessage: successMessage,
            errorMessage: errorMessage
        }).then(() => {
            this.saving = false;
            this.offlineOrganization = { name: '', org_help_url: '', country: '' };
            if (form) {
                if (isFunction(form.$setUntouched)) {
                    form.$setUntouched();
                }
                if (isFunction(form.$setPristine)) {
                    form.$setPristine();
                }
            }
        }).catch(() => {
            this.saving = false;
        });
    }
}

const OfflineOrganization = {
    template: require('./offlineOrganization.html'),
    controller: OfflineOrganizationController
};

import 'angular-gettext';
import api, { ApiService } from '../../../common/api/api.service';

export default angular.module('mpdx.preferences.admin.offlineOrganization.component', [
    'gettext',
    api
]).component('preferencesAdminOfflineOrganization', OfflineOrganization).name;
