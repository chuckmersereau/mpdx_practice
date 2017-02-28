import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';

class PreferencesLanguageController {
    language;
    saving;
    serverConstants;
    users;
    constructor(
        $window,
        language, serverConstants, users
    ) {
        this.$window = $window;
        this.language = language;
        this.serverConstants = serverConstants;
        this.users = users;

        this.saving = false;
    }
    $onChanges() {
        if (!this.users.current.preferences.locale) {
            this.users.current.preferences.locale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || 'en-us';
        }
        let found = false;
        this.languages = map((lang) => {
            const language = this.$window.languageMappingList[lang];
            if (this.users.current.preferences.locale === language) {
                found = true;
            }
            if (language) {
                return {alias: lang, value: `${language.englishName} (${language.nativeName} - ${lang})`};
            } else {
                return {alias: lang, value: `${this.serverConstants.data.languages[lang]} - ${lang}`};
            }
        }, keys(this.serverConstants.data.languages));
        if (!found) {
            this.users.current.preferences.locale = 'en';
        }
    }
    setLanguage() {
        this.language.change(this.users.current.preferences.locale);
    }
    save() {
        this.saving = true;
        this.onSave().then(() => {
            this.saving = false;
        });
    }
}

const PreferencesLanguage = {
    template: require('./language.html'),
    controller: PreferencesLanguageController,
    bindings: {
        onSave: '&',
        listOnly: '<'
    }
};

export default angular.module('mpdx.preferences.personal.language.component', [])
    .component('preferencesLanguage', PreferencesLanguage).name;