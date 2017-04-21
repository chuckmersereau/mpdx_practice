class IntegrationPreferencesController {
    alerts;
    integrations;
    selectedTab;

    constructor(
        $window, $state, $stateParams, gettextCatalog,
        alerts, help, integrations, mailchimp, modal
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.alerts = alerts;
        this.gettextCatalog = gettextCatalog;
        this.integrations = integrations;
        this.mailchimp = mailchimp;
        this.modal = modal;

        this.saving = false;
        this.tabId = '';

        this.mailchimpAccStatus = 'disabled';

        $window.openerCallback = this.reload;

        help.suggest([
            this.gettextCatalog.getString('5845aa229033600698176a54'),
            this.gettextCatalog.getString('5845ae09c6979106d373a589'),
            this.gettextCatalog.getString('5845a7f49033600698176a48'),
            this.gettextCatalog.getString('5845a6de9033600698176a43'),
            this.gettextCatalog.getString('5845af08c6979106d373a593'),
            this.gettextCatalog.getString('5845ae86c6979106d373a58c'),
            this.gettextCatalog.getString('5845af809033600698176a8c'),
            this.gettextCatalog.getString('584717b1c6979106d373afab'),
            this.gettextCatalog.getString('5848254b9033600698177ac7'),
            this.gettextCatalog.getString('57e1810ec697910d0784c3e1'),
            this.gettextCatalog.getString('584718e390336006981774ee')
        ]);
    }
    $onInit() {
        this.integrations.load();
    }
    $onChanges(data) {
        if (data.selectedTab) {
            this.setTab(this.selectedTab);
        }
    }
    sync(service) {
        this.saving = true;
        this.service = service;
        return this.integrations.sync(service).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX is now syncing your newsletter recipients with {service}.', {service: this.service}), 'success');
        }).catch(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString(`MPDX couldn't save your configuration changes for {service}.`, {service: this.service}), 'danger');
        });
    }
    disconnect(service, id) {
        this.saving = true;
        this.service = service;
        return this.integrations.disconnect(service).then(() => {
            this.saving = false;
            this.alerts.addAlert(this.gettextCatalog.getString('MPDX removed your integration with with {service}.', {service: this.service}), 'success');
            this.integrations.load();
        }).catch((data) => {
            this.alerts.addAlert(this.gettextCatalog.getString(`MPDX couldn't save your configuration changes for {service}. {error}`, {service: this.service, error: data.error}), 'danger');
            this.saving = false;
        }, id);
    }
    reload() {
        this.integrations.load();
    }
    sendToChalkline() {
        this.modal.confirm(this.gettextCatalog.getString('Would you like MPDX to email Chalkline your newsletter list and open their order form in a new tab?')).then(() => {
            this.integrations.sendToChalkline().then(() => {
                this.$window.open('http://www.chalkline.org/order_mpdx.html', '_blank');
            });
        });
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            this.tabId = '';
        } else {
            this.tabId = service;
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
}

const Integrations = {
    controller: IntegrationPreferencesController,
    template: require('./integrations.html'),
    bindings: {
        selectedTab: '<',
        setup: '<',
        onSave: '&'
    }
};

export default angular.module('mpdx.preferences.integrations.component', [])
        .component('preferencesIntegration', Integrations).name;
