class MergePreferencesController {
    mergesService;
    alertsService;

    constructor(mergesService, alertsService) {
        this.mergesService = mergesService;
        this.alertsService = alertsService;
        this.saving = false;
    }
    merge() {
        this.saving = true;
        this.mergesService.create().then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX merged your account successfully', 'success');
            this.mergesService.load();
        }).catch(() => {
            this.alertsService.addAlert('MPDX couldn\'t merge your account', 'danger');
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
