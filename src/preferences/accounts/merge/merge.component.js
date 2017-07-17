import assign from 'lodash/fp/assign';
import findIndex from 'lodash/fp/findIndex';
import reject from 'lodash/fp/reject';

class MergePreferencesController {
    accounts;
    alerts;
    api;
    onSave;
    setup;
    users;

    constructor(
        $state, gettextCatalog,
        accounts, api, alerts, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.users = users;

        this.saving = false;
        this.selected_account_id = null;
    }
    merge() {
        this.saving = true;
        return this.api.post(`account_lists/${this.api.account_list_id}/merge`, { account_list_to_merge: {id: this.selected_account_id} }).then((data) => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX merged your account successfully'), 'success');
            this.users.current.account_lists = reject({id: this.selected_account_id}, this.users.current.account_lists);
            const target = findIndex({id: this.api.account_list_id}, this.accounts.data);
            if (target > -1) {
                this.accounts.data[target] = assign(this.accounts.data[target], data);
            }
            this.onSave();
            return data;
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString(`MPDX couldn't merge your account`), 'danger');
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

import accounts from 'common/accounts/accounts.service';
import api from 'common/api/api.service';
import alerts from 'common/alerts/alerts.service';
import gettext from 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.accounts.merge.component', [
    gettext, uiRouter,
    accounts, api, alerts, users
]).component('mergePreferences', Merge).name;
