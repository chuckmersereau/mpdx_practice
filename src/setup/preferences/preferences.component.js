const numberOfControls = 3;

class SetupPreferencesController {
    accounts;
    alerts;
    users;
    constructor(
        $state,
        accounts, alerts, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.users = users;

        this.nav = 0;
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'preferences';
        this.users.setOption(this.users.current.options.setup_position);
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
        this.nav++;
        this.saving = true;
        return this.accounts.saveCurrent().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.saving = false;
            if (this.nav === numberOfControls) {
                this.$state.go('setup.notifications');
            }
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