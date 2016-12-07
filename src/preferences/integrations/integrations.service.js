class IntegrationsService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.data = {};
        this.loading = true;

        this.load();

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        this.api.get('preferences/integrations').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    sync(service, success, error) {
        var serviceToSync = service.toLowerCase();
        if (serviceToSync === 'prayer letters') {
            return this.api.get('preferences/integrations/prayer_letters_account/sync').then(success).catch(error);
        }
        if (serviceToSync === 'pls') {
            return this.api.get('preferences/integrations/pls_account/sync').then(success).catch(error);
        }
    }
    sendToChalkline(success, error) {
        return this.api.post('preferences/integrations/send_to_chalkline', { }).then(success).catch(error);
    }
    disconnect(service, success, error, id) {
        var serviceToDisconnect = service.toLowerCase();
        if (serviceToDisconnect === 'google') {
            return this.api.delete('preferences/integrations/google_accounts/' + id, { }).then(success).catch(error);
        }
        if (serviceToDisconnect === 'key') {
            return this.api.delete('preferences/integrations/key_accounts/' + id, { }).then(success).catch(error);
        }
        if (serviceToDisconnect === 'prayer letters') {
            return this.api.delete('preferences/integrations/prayer_letters_account', { }).then(success).catch(error);
        }
        if (serviceToDisconnect === 'pls') {
            return this.api.delete('preferences/integrations/pls_account', { }).then(success).catch(error);
        }
    }
}
export default angular.module('mpdx.preferences.integrations.service', [])
    .service('integrationsService', IntegrationsService).name;
