const numberOfControls = 3;

class SetupPreferencesController {
    constructor(
        $state,
        users
    ) {
        this.$state = $state;
        this.nav = 0;

        users.current.options.setup_position.value = 'preferences';
        users.setOption(users.current.options.setup_position);
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