import { defaultTo, find } from 'lodash/fp';

class LocaleController {
    constructor(
        locale, serverConstants, users
    ) {
        this.locale = locale;
        this.serverConstants = serverConstants;
        this.users = users;

        this.saving = false;
    }
    $onChanges() {
        /* istabul ignore next */
        const defaultLocale = navigator.language || navigator.browserLanguage || navigator.systemLanguage
            || navigator.userLanguage || 'en';
        this.users.current.preferences.locale_display = defaultTo(defaultLocale,
            this.users.current.preferences.locale_display);
        this.languages = this.locale.getLocalesMap();
        const found = find({ alias: this.users.current.preferences.locale_display }, this.languages);
        this.users.current.preferences.locale_display = found ? this.users.current.preferences.locale_display : 'en';
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

import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.personal.locale.component', [
    locale, serverConstants, users
]).component('preferencesPersonalLocale', Locale).name;
