import 'angular-gettext';
import { isFunction } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';

class ResetAccountController {
    resetAccount: any;
    saving: boolean;
    constructor(
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService
    ) {
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

export default angular.module('mpdx.preferences.admin.resetAccount.component', [
    'gettext',
    api
]).component('preferencesAdminResetAccount', ResetAccount).name;
