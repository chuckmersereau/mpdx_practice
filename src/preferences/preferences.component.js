class PreferencesController {
}

const Preferences = {
    controller: PreferencesController,
    controllerAs: 'vm',
    template: require('./preferences.html')
};

export default angular.module('mpdx.preferences.component', [])
    .component('preferences', Preferences).name;
