class PreferencesLocaleController {
    locale;
    saving;
    constructor(
        $window,
        locale
    ) {
        this.locale = locale;

        this.saving = false;
        this.languages = _.map(_.keys($window.languageMappingList), (key) => {
            return _.extend({alias: key}, window.languageMappingList[key]);
        });
    }
    setLocale() {
        this.locale.change(this.locale);
        this.onChange({locale: this.locale});
    }
    save() {
        this.saving = true;
        this.onSave().then(() => {
            this.saving = false;
        });
    }
}

const PreferencesLocale = {
    template: require('./locale.html'),
    component: PreferencesLocaleController,
    bindings: {
        locale: '<',
        onChange: '&',
        onSave: '&'
    }
};

export default angular.module('mpdx.preferences.personal.locale.component', [])
    .component('preferencesLocale', PreferencesLocale).name;