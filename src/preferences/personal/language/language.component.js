import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';

class LanguageController {
    constructor(
        $transitions, $window,
        language, serverConstants, users
    ) {
        this.$transitions = $transitions;
        this.$window = $window;
        this.language = language;
        this.serverConstants = serverConstants;
        this.users = users;

        this.lastLanguage = null;
        this.saving = false;
        this.deregisterTransitionHook = null;
    }
    $onInit() {
        this.deregisterTransitionHook = this.$transitions.onBefore({
            from: 'preferences.personal',
            to: (state) => state.name !== 'preferences.personal'
        }, () => {
            this.revertLanguage();
        });
    }
    $onChanges() {
        if (!this.users.current.preferences.locale) {
            this.users.current.preferences.locale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || 'en-us';
        }
        let found = false;
        this.languages = map((lang) => {
            const language = this.$window.languageMappingList[lang];
            if (this.users.current.preferences.locale === lang) {
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
        this.lastLanguage = this.users.current.preferences.locale;
    }
    $onDestroy() {
        if (this.deregisterTransitionHook) {
            this.deregisterTransitionHook();
        }
    }
    setLanguage() {
        this.language.change(this.users.current.preferences.locale);
        if (this.listOnly) {
            this.users.saveCurrent();
        }
    }
    revertLanguage() {
        this.users.current.preferences.locale = this.lastLanguage;
        this.setLanguage();
    }
    save() {
        this.saving = true;
        return this.onSave().then(() => {
            this.saving = false;
            this.lastLanguage = this.users.current.preferences.locale;
        }).catch(err => {
            this.saving = false;
            throw err;
        });
    }
}

const Language = {
    template: require('./language.html'),
    controller: LanguageController,
    bindings: {
        onSave: '&',
        setup: '<',
        listOnly: '<'
    }
};

import language from 'common/language/language.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.personal.language.component', [
    language, serverConstants, users
]).component('preferencesPersonalLanguage', Language).name;
