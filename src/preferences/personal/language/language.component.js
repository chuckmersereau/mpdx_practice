import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';

class LanguageController {
    constructor(
        $transitions,
        language, serverConstants, users
    ) {
        this.$transitions = $transitions;
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
        /* istabul ignore next */
        const defaultLocale = navigator.language || navigator.browserLanguage || navigator.systemLanguage
            || navigator.userLanguage || 'en-us';
        this.users.current.preferences.locale = defaultTo(defaultLocale, this.users.current.preferences.locale);
        const lang = get(this.users.current.preferences.locale, this.serverConstants.data.languages);
        this.users.current.preferences.locale = lang ? this.users.current.preferences.locale : 'en-us';

        this.languages = map((lang) => ({
            alias: lang,
            value: `${this.serverConstants.data.languages[lang]}`
        }), keys(this.serverConstants.data.languages));
        this.lastLanguage = angular.copy(this.users.current.preferences.locale);
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
        }).catch((err) => {
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
