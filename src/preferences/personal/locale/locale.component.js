class PreferencesLocaleController {
    locale;
    saving;
    serverConstants;
    users;
    constructor(
        $window,
        locale, serverConstants, users
    ) {
        this.$window = $window;
        this.locale = locale;
        this.serverConstants = serverConstants;
        this.users = users;

        this.saving = false;
    }
    $onChanges() {
        this.languages = _.map(_.keys(this.serverConstants.data.locales), (locale) => {
            const language = this.$window.languageMappingList[locale];
            if (language) {
                return {alias: locale, value: `${language.englishName} (${language.nativeName} - ${locale})`};
            } else {
                return {alias: locale, value: this.serverConstants.data.locales[locale]};
            }
        });
    }
    setLocale() {
        this.locale.change(this.users.current.preferences.locale);
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
    controller: PreferencesLocaleController,
    bindings: {
        onSave: '&',
        listOnly: '<'
    }
};

export default angular.module('mpdx.preferences.personal.locale.component', [])
    .component('preferencesLocale', PreferencesLocale).name;