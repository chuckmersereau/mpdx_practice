class IntegrationPreferencesController {
    alerts;
    integrations;

    constructor(
        $window, $state, $stateParams, integrations, alerts, help
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.alerts = alerts;
        this.integrations = integrations;

        this.saving = false;
        this.tabId = '';

        this.mailchimpAccStatus = 'disabled';

        $window.openerCallback = this.reload;

        help.suggest([
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
    $onInit() {
        this.integrations.load();
    }
    sync(service) {
        this.saving = true;
        this.service = service;
        return this.integrations.sync(service).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX is now syncing your newsletter recipients with ' + this.service, 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for ' + this.service, 'danger');
        });
    }
    disconnect(service, id) {
        this.saving = true;
        this.service = service;
        return this.integrations.disconnect(service).then(() => {
            this.saving = false;
            this.alerts.addAlert('MPDX removed your integration with ' + this.service, 'success');
            this.integrations.load();
        }).catch((data) => {
            this.alerts.addAlert('MPDX couldn\'t save your configuration changes for ' + this.service + '. ' + data.error, 'danger');
            this.saving = false;
        }, id);
    }
    reload() {
        this.integrations.load();
    }
    sendToChalkline() {
        this.integrations.sendToChalkline();
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
