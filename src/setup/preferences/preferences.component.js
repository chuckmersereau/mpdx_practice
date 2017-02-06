class SetupPreferencesController {
    constructor() {
        this.nav = 0;
    }
    save() {
        this.nav++;
    }
}

const SetupPreferences = {
    template: require('./preferences.html'),
    controller: SetupPreferencesController
};

export default angular.module('mpdx.setup.preferences.component', [])
    .component('setupPreferences', SetupPreferences).name;