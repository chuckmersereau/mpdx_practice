import { defaultTo, find, findIndex, get, map, split, toLower } from 'lodash/fp';
import uuid from 'uuid/v1';

class PersonalController {
    constructor(
        $state, $stateParams, gettextCatalog,
        accounts, api, designationAccounts, locale, serverConstants, users
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.accounts = accounts;
        this.api = api;
        this.designationAccounts = designationAccounts;
        this.locale = locale;
        this.gettextCatalog = gettextCatalog;
        this.serverConstants = serverConstants;
        this.users = users;

        this.email = '';
        this.saving = false;
        this.tabId = '';

        this.currencies = map((pc) => {
            return { key: pc.code, value: `${pc.name} - ${pc.code_symbol_string}` };
        }, serverConstants.data.pledge_currencies);
    }
    $onInit() {
        if (this.$stateParams.id || this.selectedTab) {
            this.setTab(this.$stateParams.id || this.selectedTab);
        }
    }
    getEmail(data) {
        const primaryEmail = find({ primary: true }, data.email_addresses);
        const firstEmail = get('email_addresses[0]', data);
        const newEmail = { id: uuid(), email: '' };
        return defaultTo(defaultTo(newEmail, firstEmail), primaryEmail);
    }
    $onChanges(data) {
        if (data.selectedTab) {
            this.setTab(this.selectedTab);
        }
        this.email = this.getEmail(this.users.current);
        this.setSalaryOrg();
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
        const successMessage = this.gettextCatalog.getString('Preferences saved successfully');
        return this.users.saveCurrent(successMessage).then(() => {
            this.setTab('');
            this.saving = false;
            this.onSave();
        }).catch((data) => {
            this.saving = false;
            throw data;
        });
    }
    saveAccount() {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('Preferences saved successfully');
        return this.accounts.saveCurrent(successMessage).then(() => {
            this.setTab('');
            this.onSave();
            this.saving = false;
        }).catch((data) => {
            this.saving = false;
            throw data;
        });
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            if (!this.selectedTab) {
                this.tabId = '';
            }
        } else if (this.selectedTab) {
            if (this.tabSelectable(service)) {
                this.tabId = service;
            }
        } else {
            this.tabId = service;
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
        const currentOrg = find({ id: this.accounts.current.salary_organization },
            this.designationAccounts.organizations);
        this.salary_organization_string = get('name', currentOrg);
    }
    getCountry(locale) {
        if (!locale) { return; }
        if (locale === 'en') { return 'us'; }
        const splitLocale = split('-', locale);
        if (splitLocale.length > 1) {
            return toLower(splitLocale[1]);
        }
        return locale;
    }
    getLanguage(language) {
        return get(language, this.serverConstants.data.languages);
    }
    getLocale(locale) {
        return get('native_name', get(locale, this.serverConstants.data.locales));
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

import uiRouter from '@uirouter/angularjs';
import gettextCatalog from 'angular-gettext';
import accounts from 'common/accounts/accounts.service';
import api from 'common/api/api.service';
import designationAccounts from 'common/designationAccounts/designationAccounts.service';
import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.personal.component', [
    uiRouter, gettextCatalog,
    accounts, api, designationAccounts, locale, serverConstants, users
]).component('preferencesPersonal', Personal).name;
