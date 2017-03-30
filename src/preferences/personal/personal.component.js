import defaultTo from 'lodash/fp/defaultTo';
import each from 'lodash/fp/each';
import find from 'lodash/fp/find';
import findIndex from 'lodash/fp/findIndex';
import get from 'lodash/fp/get';
import has from 'lodash/fp/has';
import map from 'lodash/fp/map';
import split from 'lodash/fp/split';
import toLower from 'lodash/fp/toLower';
import uuid from 'uuid/v1';

class PersonalController {
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

        this.email = '';
        this.saving = false;
        this.tabId = '';

        this.currencies = map(pc => {
            return { key: pc.code, value: `${pc.name} - ${pc.code_symbol_string}` };
        }, serverConstants.data.pledge_currencies);
    }
    $onInit() {
        if (this.$stateParams.id || this.selectedTab) {
            this.setTab(this.$stateParams.id || this.selectedTab);
        }
        this.email = this.getEmail(this.users.current);
    }
    getEmail(data) {
        const primaryEmail = find({primary: true}, data.email_addresses);
        const firstEmail = get('email_addresses[0]', data);
        const newEmail = {id: uuid(), email: ''};
        return defaultTo(defaultTo(newEmail, firstEmail), primaryEmail);
    }
    $onChanges(data) {
        if (data.selectedTab) {
            this.setTab(this.selectedTab);
        }
        this.email = this.getEmail(this.users.current);
    }
    saveEmail() {
        this.saving = true;
        const index = findIndex(this.users.current.email_addresses);
        if (index > -1) {
            this.users.current.email_addresses[index].email = this.email.email;
        } else {
            this.users.current.email_addresses = [this.email];
        }
        this.save();
    }
    save() {
        this.saving = true;
        return this.users.saveCurrent().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.saving = false;
            this.onSave();
        }).catch(data => {
            if (data) {
                each((value) => {
                    this.alerts.addAlert(value, 'danger');
                }, data.errors);
            }
            this.saving = false;
        });
    }
    saveAccount() {
        this.saving = true;
        return this.accounts.saveCurrent().then(() => {
            this.alerts.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.onSave();
            this.saving = false;
        }).catch((data) => {
            if (data) {
                each((value) => {
                    this.alerts.addAlert(value, 'danger');
                }, data.errors);
            }
            this.saving = false;
        });
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            if (!this.selectedTab) {
                this.tabId = '';
            }
        } else {
            if (this.selectedTab) {
                if (this.tabSelectable(service)) {
                    this.tabId = service;
                }
            } else {
                this.tabId = service;
            }
        }
    }
    tabSelectable(service) {
        if (this.selectedTab) {
            return this.selectedTab === service;
        }
        return true;
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
    controller: PersonalController,
    template: require('./personal.html'),
    bindings: {
        selectedTab: '<',
        setup: '<',
        onSave: '&'
    }
};

export default angular.module('mpdx.preferences.personal.component', [])
    .component('preferencesPersonal', Personal).name;
