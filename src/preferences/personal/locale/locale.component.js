import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';

class LocaleController {
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
        if (!this.users.current.preferences.locale_display) {
            this.users.current.preferences.locale_display = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || 'en-us';
        }
        let found = false;
        this.languages = map((locale) => {
            const language = this.$window.languageMappingList[locale];
            if (this.users.current.preferences.locale_display === locale) {
                found = true;
            }
            if (language) {
                return {alias: locale, value: `${language.englishName} (${language.nativeName} - ${locale})`};
            } else {
                return {alias: locale, value: `${this.serverConstants.data.locales[locale].english_name} (${this.serverConstants.data.locales[locale].native_name} - ${locale})`};
            }
        }, keys(this.serverConstants.data.locales));
        if (!found) {
            this.users.current.preferences.locale_display = 'en';
        }
    }
    setLocale() {
        this.locale.change(this.users.current.preferences.locale_display);
    }
}

const Locale = {
    template: require('./locale.html'),
    controller: LocaleController,
    bindings: {
        onSave: '&',
        listOnly: '<'
    }
};

export default angular.module('mpdx.preferences.personal.locale.component', [])
    .component('preferencesPersonalLocale', Locale).name;
