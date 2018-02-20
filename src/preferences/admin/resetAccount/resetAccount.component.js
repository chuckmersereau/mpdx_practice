import { isFunction } from 'lodash/fp';

class ResetAccountController {
    constructor(
        gettextCatalog,
        api
    ) {
        this.gettextCatalog = gettextCatalog;
        this.api = api;
        this.saving = false;
        this.resetAccount = { resetted_user_email: '', reason: '', account_list_name: '' };
    }
    save(form) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('Successfully reset account');
        const errorMessage = this.gettextCatalog.getString('Unable to reset account');
        return this.api.post({
            url: 'admin/resets',
            data: this.resetAccount,
            type: 'resets',
            errorMessage: errorMessage,
            successMessage: successMessage
        }).then(() => {
            this.saving = false;
            this.resetAccount = { resetted_user_email: '', reason: '', account_list_name: '' };
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

const ResetAccount = {
    template: require('./resetAccount.html'),
    controller: ResetAccountController
};

import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';

export default angular.module('mpdx.preferences.admin.resetAccount.component', [
    gettextCatalog,
    api
]).component('preferencesAdminResetAccount', ResetAccount).name;
