class IntegrationPreferencesController {
    constructor(
        $window, $state, $stateParams, integrationsService, alertsService
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.preferences = integrationsService;
        this.alerts = alertsService;

        this.saving = false;
        this.tabId = '';

        this.mailchimpAccStatus = 'disabled';

        $window.openerCallback = this.reload;

        this.activate();
    }
    activate() {
        if (this.$stateParams.id) {
            this.setTab(this.$stateParams.id);
        }
    }
    sync(service) {
        this.saving = true;
        this.service = service;
        this.preferences.sync(service, () => {
            this.saving = false;
            this.alerts.addAlert('MPDX is now syncing your newsletter recipients with ' + this.service, 'success');
        }, () => {
            this.saving = false;
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for ' + this.service, 'danger');
        });
    }
    disconnect(service, id) {
        this.saving = true;
        this.service = service;
        this.preferences.disconnect(service, () => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed your integration with ' + this.service, 'success');
            this.preferences.load();
        }, (data) => {
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for ' + this.service + '. ' + data.error, 'danger');
            this.saving = false;
        }, id);
    }
    reload() {
        this.preferences.load();
    }
    sendToChalkline() {
        this.preferences.sendToChalkline();
        this.$window.open('http://www.chalkline.org/order_mpdx.html', '_blank');
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            this.tabId = '';
            this.$state.go('preferences.integrations', {}, { notify: false });
        } else {
            this.tabId = service;
            this.$state.go('preferences.integrations.tab', { id: service }, { notify: false });
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
}

const Integrations = {
    controller: IntegrationPreferencesController,
    controllerAs: 'vm',
    template: require('./integrations.html')
};

export default angular.module('mpdx.preferences.integrations.component', [])
        .component('integrationPreferences', Integrations).name;
