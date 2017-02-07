class SetupPreferencesController {
    constructor(
        $state
    ) {
        this.$state = $state;
        this.nav = 0;
    }
    save() {
        this.nav++;
        this.saving = true;
        return this.users.saveCurrent().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.saving = false;
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
    saveAccount() {
        this.saving = true;
        return this.accounts.saveCurrent().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.saving = false;
            this.$state.go('setup.notifications');
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
}

const SetupPreferences = {
    template: require('./preferences.html'),
    controller: SetupPreferencesController
};

export default angular.module('mpdx.setup.preferences.component', [])
    .component('setupPreferences', SetupPreferences).name;