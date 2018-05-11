import { defaultTo, find } from 'lodash/fp';
import locale, { LocaleService } from '../../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import users, { UsersService } from '../../../common/users/users.service';

class LocaleController {
    languages: any[];
    saving: boolean;
    constructor(
        private locale: LocaleService,
        private serverConstants: ServerConstantsService,
        private users: UsersService
    ) {
        this.saving = false;
    }
    $onChanges() {
        /* istabul ignore next */
        const defaultLocale = navigator.language || (navigator as any).browserLanguage
            || (navigator as any).systemLanguage || (navigator as any).userLanguage || 'en';
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

export default angular.module('mpdx.preferences.personal.locale.component', [
    locale, serverConstants, users
]).component('preferencesPersonalLocale', Locale).name;
