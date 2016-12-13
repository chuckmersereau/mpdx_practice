class IntegrationPreferencesController {
    alertsService;
    integrationsService;
    rolloutService;

    constructor(
        $window, $state, $stateParams, integrationsService, alertsService, rolloutService, helpService
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.alertsService = alertsService;
        this.integrationsService = integrationsService;
        this.rolloutService = rolloutService;

        this.saving = false;
        this.tabId = '';

        this.mailchimpAccStatus = 'disabled';

        $window.openerCallback = this.reload;

        helpService.suggest([
            '5845aa229033600698176a54',
            '5845ae09c6979106d373a589',
            '5845a7f49033600698176a48',
            '5845a6de9033600698176a43',
            '5845af08c6979106d373a593',
            '5845ae86c6979106d373a58c',
            '5845af809033600698176a8c',
            '584717b1c6979106d373afab',
            '5848254b9033600698177ac7',
            '57e1810ec697910d0784c3e1',
            '584718e390336006981774ee'
        ]);

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
        return this.integrationsService.sync(service).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX is now syncing your newsletter recipients with ' + this.service, 'success');
        }).catch(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX couldn\'t save your configuration changes for ' + this.service, 'danger');
        });
    }
    disconnect(service, id) {
        this.saving = true;
        this.service = service;
        return this.integrationsService.disconnect(service).then(() => {
            this.saving = false;
            this.alertsService.addAlert('MPDX removed your integration with ' + this.service, 'success');
            this.integrationsService.load();
        }).catch((data) => {
            this.alertsService.addAlert('MPDX couldn\'t save your configuration changes for ' + this.service + '. ' + data.error, 'danger');
            this.saving = false;
        }, id);
    }
    reload() {
        this.integrationsService.load();
    }
    sendToChalkline() {
        this.integrationsService.sendToChalkline();
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
    template: require('./integrations.html')
};

export default angular.module('mpdx.preferences.integrations.component', [])
        .component('integrationPreferences', Integrations).name;
