const SetupPreferences = {
    template: require('./preferences.html')
};

export default angular.module('mpdx.setup.preferences.component', [])
    .component('setupPreferences', SetupPreferences).name;
