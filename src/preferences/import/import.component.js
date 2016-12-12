class ImportPreferencesController {
    alerts;
    importsService;

    constructor(
        $filter, $state, $stateParams, importsService, alerts
    ) {
        this.$filter = $filter;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.importsService = importsService;
        this.alerts = alerts;

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
                this.importsService.load();
            }
            this.$state.go('preferences.imports.tab', { id: service }, { notify: false });
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
    loadTags(query) {
        return this.$filter('filter')(this.importsService.data.tags, { text: query });
    }

    checkAllGoogleContactGroups() {
        this.importsService.google_contact_import.groups = this.importsService.selected_account.contact_groups.map(item => item.id);
    }
    uncheckAllGoogleContactGroups() {
        this.importsService.google_contact_import.groups = [];
    }
    saveGoogleImport() {
        this.saving = true;
        this.importsService.saveGoogleImport().then(() => {
            this.alerts.addAlert('MPDx is importing contacts from your Google Account', 'success');
            this.setTab('');
            this.saving = false;
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
}

const Import = {
    controller: ImportPreferencesController,
    template: require('./import.html')
};

export default angular.module('mpdx.preferences.imports.component', [])
    .component('importPreferences', Import).name;
