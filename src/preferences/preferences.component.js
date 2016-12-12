class PreferencesController {
    accounts;

    constructor(accounts) {
        this.accounts = accounts;
    }
}

const Preferences = {
    controller: PreferencesController,
    template: require('./preferences.html')
};

export default angular.module('mpdx.preferences.component', [])
    .component('preferences', Preferences).name;
