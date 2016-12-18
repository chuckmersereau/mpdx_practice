class MergePreferencesController {
    preferencesMerges;
    alerts;

    constructor(preferencesMerges, alerts) {
        this.preferencesMerges = preferencesMerges;
        this.alerts = alerts;
        this.saving = false;
    }
    merge() {
        this.saving = true;
        this.preferencesMerges.create().then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX merged your account successfully', 'success');
            this.preferencesMerges.load();
        }).catch(() => {
            this.alerts.addAlert('MPDX couldn\'t merge your account', 'danger');
            this.saving = false;
        });
    }
}

const Merge = {
    controller: MergePreferencesController,
    template: require('./merge.html')
};

export default angular.module('mpdx.preferences.accounts.merge.component', [])
    .component('mergePreferences', Merge).name;
