class PersonalPreferencesController {
    accounts;
    alerts;
    api;
    locale;
    users;

    constructor(
        $state, $stateParams, $window, gettextCatalog,
        accounts, api, alerts, locale, users
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.locale = locale;
        this.gettextCatalog = gettextCatalog;
        this.users = users;

        this.saving = false;
        this.tabId = '';
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
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
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
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
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
        const splitLocale = locale.split('-');
        if (splitLocale.length > 1) {
            return splitLocale[1].toLowerCase();
        }
        return locale;
    }
}

const Personal = {
    controller: PersonalPreferencesController,
    template: require('./personal.html')
};

export default angular.module('mpdx.preferences.personal.component', [])
    .component('personalPreferences', Personal).name;
