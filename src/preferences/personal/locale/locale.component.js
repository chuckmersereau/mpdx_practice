class PreferencesLocaleController {
}

const PreferencesLocale = {
    template: require('./locale.html'),
    component: PreferencesLocaleController
};

export default angular.module('mpdx.preferences.personal.locale.component', [])
    .component('preferencesLocale', PreferencesLocale).name;