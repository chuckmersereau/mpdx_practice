class PreferencesController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
}

const Preferences = {
    controller: PreferencesController,
    template: require('./preferences.html')
};

export default angular.module('mpdx.preferences.component', [])
    .component('preferences', Preferences).name;
