import { defaultTo, get, keys, map } from 'lodash/fp';
import { TransitionService } from '@uirouter/core';
import language, { LanguageService } from '../../../common/language/language.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import users, { UsersService } from '../../../common/users/users.service';

class LanguageController {
    deregisterTransitionHook: any;
    languages: any[];
    lastLanguage: string;
    listOnly: boolean;
    onSave: any;
    saving: boolean;
    constructor(
        private $transitions: TransitionService,
        private language: LanguageService,
        private serverConstants: ServerConstantsService,
        private users: UsersService
    ) {
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
        const defaultLocale = navigator.language || (navigator as any).browserLanguage
            || (navigator as any).systemLanguage || (navigator as any).userLanguage || 'en-us';
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

export default angular.module('mpdx.preferences.personal.language.component', [
    language, serverConstants, users
]).component('preferencesPersonalLanguage', Language).name;
