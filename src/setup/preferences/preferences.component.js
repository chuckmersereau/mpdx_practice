class SetupPreferencesController {
    constructor(accounts) {
        this.accounts = accounts;
    }
}

const SetupPreferences = {
    template: require('./preferences.html'),
    controller: SetupPreferencesController
};

export default angular.module('mpdx.setup.preferences.component', [])
    .component('setupPreferences', SetupPreferences).name;
