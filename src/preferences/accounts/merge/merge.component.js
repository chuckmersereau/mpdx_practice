class MergePreferencesController {
    constructor(mergesService, alertsService) {
        this.preferences = mergesService;
        this.alerts = alertsService;
        this.saving = false;
    }
    merge() {
        this.saving = true;
        this.preferences.create(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX merged your account successfully', 'success');
            this.preferences.load();
        }, () => {
            this.alerts.addAlert('MPDX couldn\'t merge your account', 'danger');
            this.saving = false;
        });
    }
}

const Merge = {
    controller: MergePreferencesController,
    controllerAs: 'vm',
    template: require('./merge.html')
};

export default angular.module('mpdx.preferences.accounts.merge.component', [])
    .component('mergePreferences', Merge).name;
