import { assign, findIndex, reject } from 'lodash/fp';

class MergePreferencesController {
    onSave: any;
    saving: boolean;
    selected_account_id: string;
    constructor(
        private $state: StateService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private api: ApiService,
        private users: UsersService
    ) {
        this.saving = false;
        this.selected_account_id = null;
    }
    merge() {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('MPDX merged your account successfully');
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t merge your account');
        return this.api.post(`account_lists/${this.api.account_list_id}/merge`, {
            account_list_to_merge: { id: this.selected_account_id }
        }, successMessage, errorMessage).then((data) => {
            this.saving = false;
            this.users.current.account_lists = reject({ id: this.selected_account_id },
                this.users.current.account_lists);
            const target = findIndex({ id: this.api.account_list_id }, this.accounts.data);
            if (target > -1) {
                this.accounts.data[target] = assign(this.accounts.data[target], data);
            }
            this.onSave();
            return data;
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
}

const Merge = {
    controller: MergePreferencesController,
    template: require('./merge.html'),
    bindings: {
        onSave: '&'
    }
};

import 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import { StateService } from '@uirouter/core';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import api, { ApiService } from '../../../common/api/api.service';
import users, { UsersService } from '../../../common/users/users.service';

export default angular.module('mpdx.preferences.accounts.merge.component', [
    'gettext', uiRouter,
    accounts, api, users
]).component('mergePreferences', Merge).name;
