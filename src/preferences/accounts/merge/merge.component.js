import assign from 'lodash/fp/assign';
import findIndex from 'lodash/fp/findIndex';
import reject from 'lodash/fp/reject';

class MergePreferencesController {
    accounts;
    api;
    alerts;
    preferencesMerges;
    setup;
    users;

    constructor(
        $state,
        accounts, api, alerts, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.users = users;

        this.saving = false;
        this.selected_account_id = null;
    }
    merge() {
        this.saving = true;
        return this.api.post(`account_lists/${this.api.account_list_id}/merge`, { account_list_to_merge: {id: this.selected_account_id} }).then((data) => {
            this.saving = false;
            this.alerts.addAlert('MPDX merged your account successfully', 'success');
            this.user.account_lists = reject({id: this.selected_account_id}, this.user.account_lists);
            const target = findIndex({id: this.api.account_list_id}, this.accounts.data);
            if (target > -1) {
                this.accounts.data[target] = assign(this.accounts.data[target], data);
            }
            this.onSave();
            return data;
        }).catch(() => {
            this.alerts.addAlert('MPDX couldn\'t merge your account', 'danger');
            this.saving = false;
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

export default angular.module('mpdx.preferences.accounts.merge.component', [])
    .component('mergePreferences', Merge).name;
