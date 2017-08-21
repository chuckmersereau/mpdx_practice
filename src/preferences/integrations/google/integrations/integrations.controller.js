class GoogleIntegrationsModalController {
    constructor(
        $log, blockUI, gettextCatalog,
        googleIntegrations, modal, serverConstants, google,
        googleIntegration, googleAccount
    ) {
        this.$log = $log;
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('googleIntegrations');

        this.googleIntegrations = googleIntegrations;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.google = google;

        this.googleIntegration = googleIntegration;
        this.googleAccount = googleAccount;

        this.activeTab = 'calendar';
    }
    enable(integrationName) {
        this.blockUI.start();
        this.googleIntegrations.enable(this.googleAccount, this.googleIntegration, integrationName).then((data) => {
            this.blockUI.reset();
            this.googleIntegration = data;
        });
    }
    disable(integrationName) {
        const message = this.gettextCatalog.getString('Are you sure you want to disable Google {{name}} sync?', {
            name: integrationName
        });
        this.modal.confirm(message).then(() => {
            this.blockUI.start();
            this.googleIntegrations.disable(this.googleAccount, this.googleIntegration, integrationName)
                .then((data) => {
                    this.blockUI.reset();
                    this.googleIntegration = data;
                });
        });
    }
    sync(integrationName) {
        this.blockUI.start();
        this.googleIntegrations.sync(this.googleAccount, this.googleIntegration, integrationName).then(() => {
            this.blockUI.reset();
        });
    }
    save() {
        this.googleIntegrations.save(this.googleAccount, this.googleIntegration);
    }
}

export default angular.module('mpdx.preferences.integrations.google.integrations.controller', [])
    .controller('googleIntegrationsModalController', GoogleIntegrationsModalController).name;
