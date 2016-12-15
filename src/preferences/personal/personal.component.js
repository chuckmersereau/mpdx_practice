class PersonalPreferencesController {
    accountsMap;
    accounts;
    alerts;
    api;
    users;

    constructor(
        $state, $stateParams, $window, gettextCatalog,
        accounts, api, alerts, users
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.users = users;

        this.saving = false;
        this.tabId = '';

        this.languages = _.map(_.keys($window.languageMappingList), (key) => {
            return _.extend({alias: key}, window.languageMappingList[key]);
        });

        this.accountsMap = {};
        _.each(this.accounts.data, (account) => {
            this.accountsMap[account.id] = account;
        });
        this.default_account_list = this.users.current.attributes.preferences.default_account_list.toString();
    }
    $onInit() {
        if (this.$stateParams.id) {
            this.setTab(this.$stateParams.id);
        }
    }
    save() {
        this.saving = true;
        return this.users.save(this.users.current).then(() => {
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
        return this.accounts.save(this.accountsMap[this.api.account_list_id]).then(() => {
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
    setDefaultAccountList() {
        this.users.current.attributes.preferences.default_account_list = parseInt(this.default_account_list);
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
    setLocale() {
        this.users.changeLocale(this.users.current.attributes.preferences.locale);
    }
}

const Personal = {
    controller: PersonalPreferencesController,
    template: require('./personal.html')
};

export default angular.module('mpdx.preferences.personal.component', [])
    .component('personalPreferences', Personal).name;
