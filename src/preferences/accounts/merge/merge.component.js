class MergePreferencesController {
    mergesService;
    alerts;

    constructor(mergesService, alerts) {
        this.mergesService = mergesService;
        this.alerts = alerts;
        this.saving = false;
    }
    merge() {
        this.saving = true;
        this.mergesService.create().then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX merged your account successfully', 'success');
            this.mergesService.load();
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
