class PersonalPreferencesController {
    alertsService;
    rolloutService;
    personalService;

    constructor(
        $state, $stateParams, $scope, personalService, alertsService, rolloutService
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.alertsService = alertsService;
        this.rolloutService = rolloutService;
        this.personalService = personalService;

        this.saving = false;
        this.tabId = '';
        this.locale_string = '';
        this.default_account_string = '';
        this.salary_organization_string = '';

        // $scope.$watch('vm.personalService.data.locale', (newValue) => {
        //     this.locale_string = angular.element('#_locale option[value=' + newValue + ']').text();
        // });

        // $scope.$watch('vm.personalService.data.default_account_list', (newValue) => {
        //     this.default_account_string = angular.element('#_default_account_list option[value=' + newValue + ']').text();
        // });

        // $scope.$watch('vm.personalService.data.salary_organization_id', (newValue) => {
        //     this.salary_organization_string = angular.element('#salary_organization_id_ option[value=' + newValue + ']').text();
        // });
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
    setLocale() {
        this.locale_string = this.personalService.data.locale;
    }
    setSalaryOrg() {
        this.salary_organization_string = this.personalService.data.salary_organization_id;
    }
}

const Personal = {
    controller: PersonalPreferencesController,
    template: require('./personal.html')
};

export default angular.module('mpdx.preferences.personal.component', [])
    .component('personalPreferences', Personal).name;
