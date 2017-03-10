class MergePreferencesController {
    accounts;
    api;
    alerts;
    preferencesMerges;
    setup;

    constructor(
        $state, accounts, api, alerts
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;

        this.saving = false;
        this.selected_account_id = null;
    }
    merge() {
        this.saving = true;
        return this.api.post(`account_lists/${this.api.account_list_id}/merge`, { id: this.selected_account_id }).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX merged your account successfully', 'success');
            return this.accounts.load().then(() => {
                this.onSave();
            });
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
