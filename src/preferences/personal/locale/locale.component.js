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
        if (!this.users.current.preferences.locale) {
            this.users.current.preferences.locale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || 'en-us';
        }
        let found = false;
        this.languages = _.map(_.keys(this.serverConstants.data.locales), (locale) => {
            const language = this.$window.languageMappingList[locale];
            if (this.users.current.preferences.locale === locale) {
                found = true;
            }
            if (language) {
                return {alias: locale, value: `${language.englishName} (${language.nativeName} - ${locale})`};
            } else {
                return {alias: locale, value: this.serverConstants.data.locales[locale]};
            }
        });
        if (!found) {
            this.users.current.preferences.locale = 'en';
        }
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