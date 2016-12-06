class PersonalPreferencesController {
    alertsService;
    rolloutService;
    personalService;

    constructor(
        $state, $stateParams, $window,
        personalService, alertsService, gettextCatalog, rolloutService
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.alertsService = alertsService;
        this.gettextCatalog = gettextCatalog;
        this.rolloutService = rolloutService;
        this.personalService = personalService;

        this.saving = false;
        this.tabId = '';

        this.languages = _.map(_.keys($window.languageMappingList), (key) => {
            return _.extend({alias: key}, window.languageMappingList[key]);
        });
    }
    $onInit() {
        if (this.$stateParams.id) {
            this.setTab(this.$stateParams.id);
        }
    }
    save() {
        this.saving = true;
        return this.personalService.save().then(() => {
            this.alertsService.addAlert('Preferences saved successfully', 'success');
            this.setTab('');
            this.saving = false;
        }).catch((data) => {
            angular.forEach(data.errors, (value) => {
                this.alertsService.addAlert(value, 'danger');
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
        this.default_account_string = this.personalService.data.default_account_list;
    }
    setSalaryOrg() {
        this.salary_organization_string = this.personalService.data.salary_organization_id;
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
        this.personalService.changeLocale(this.personalService.data.locale);
    }
}

const Personal = {
    controller: PersonalPreferencesController,
    template: require('./personal.html')
};

export default angular.module('mpdx.preferences.personal.component', [])
    .component('personalPreferences', Personal).name;
