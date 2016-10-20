class ImportPreferencesController {
    constructor(
        $filter, $state, $stateParams, importsService, alertsService
    ) {
        this.$filter = $filter;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.preferences = importsService;
        this.alerts = alertsService;

        this.saving = false;
        this.tabId = '';

        this.activate();
    }
    activate() {
        if (this.$stateParams.id) {
            this.setTab(this.$stateParams.id);
        }
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            this.tabId = '';
            this.$state.go('preferences.imports', {}, { notify: false });
        } else {
            this.tabId = service;
            if (service === 'google') {
                this.preferences.load();
            }
            this.$state.go('preferences.imports.tab', { id: service }, { notify: false });
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
    loadTags(query) {
        return this.$filter('filter')(this.preferences.data.tags, { text: query });
    }

    checkAllGoogleContactGroups() {
        this.preferences.google_contact_import.groups = this.preferences.selected_account.contact_groups.map(item => item.id);
    }
    uncheckAllGoogleContactGroups() {
        this.preferences.google_contact_import.groups = [];
    }
    saveGoogleImport() {
        this.saving = true;
        this.preferences.saveGoogleImport(() => {
            this.alerts.addAlert('MPDx is importing contacts from your Google Account', 'success');
            this.setTab('');
            this.saving = false;
        }, (data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
}

const Import = {
    controller: ImportPreferencesController,
    controllerAs: 'vm',
    template: require('./import.html')
};

export default angular.module('mpdx.preferences.imports.component', [])
    .component('importPreferences', Import).name;
