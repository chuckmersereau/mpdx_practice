import each from 'lodash/fp/each';
import has from 'lodash/fp/has';
import map from 'lodash/fp/map';
import split from 'lodash/fp/split';
import toLower from 'lodash/fp/toLower';

class PersonalPreferencesController {
    accounts;
    alerts;
    api;
    locale;
    serverConstants;
    users;

    constructor(
        $state, $stateParams, $window, gettextCatalog,
        accounts, api, alerts, locale, serverConstants, users
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.locale = locale;
        this.gettextCatalog = gettextCatalog;
        this.serverConstants = serverConstants;
        this.users = users;

        this.saving = false;
        this.tabId = '';

        this.currencies = map(pc => {
            return { key: pc.code, value: `${pc.name} - ${pc.code_symbol_string}` };
        }, serverConstants.data.pledge_currencies);
    }
    $onInit() {
        if (this.$stateParams.id) {
            this.setTab(this.$stateParams.id);
        }
    }
    save() {
        this.saving = true;
        return this.users.saveCurrent().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.saving = false;
        }).catch((data) => {
            each((value) => {
                this.alerts.addAlert(value, 'danger');
            }, data.errors);
            this.saving = false;
        });
    }
    saveAccount() {
        this.saving = true;
        return this.accounts.saveCurrent().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.saving = false;
        }).catch((data) => {
            each((value) => {
                this.alerts.addAlert(value, 'danger');
            }, data.errors);
            this.saving = false;
        });
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            this.tabId = '';
            this.$state.go('preferences.personal', {}, { notify: false });
        } else {
            this.tabId = service;
            this.$state.go('preferences.personal.tab', { id: service }, { notify: false });
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
    setSalaryOrg() {
        this.salary_organization_string = this.personal.data.salary_organization_id;
    }
    getCountry(locale) {
        if (!locale) return;
        if (locale === 'en') return 'us';
        const splitLocale = split('-', locale);
        if (splitLocale.length > 1) {
            return toLower(splitLocale[1]);
        }
        return locale;
    }
    getLanguageOrLocaleNative(locale) {
        if (!locale) return;
        if (has(locale, this.$window.languageMappingList)) {
            return this.$window.languageMappingList[locale].nativeName;
        } else if (has(locale, this.serverConstants.data.locales)) {
            return this.serverConstants.data.locales[locale].native_name;
        } else if (has(locale, this.serverConstants.data.languages)) {
            return this.serverConstants.data.languages[locale];
        }
        return '';
    }
}

const Personal = {
    controller: PersonalPreferencesController,
    template: require('./personal.html')
};

export default angular.module('mpdx.preferences.personal.component', [])
    .component('personalPreferences', Personal).name;
