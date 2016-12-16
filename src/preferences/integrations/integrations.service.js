class IntegrationsService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.data = {};
        this.loading = true;

        this.load();

        this.account_list_id_watcher = $rootScope.$watch(() => api.account_list_id, () => {
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
    sync(service) {
        var serviceToSync = service.toLowerCase();
        if (serviceToSync === 'prayer letters') {
            return this.api.get('preferences/integrations/prayer_letters_account/sync');
        }
        if (serviceToSync === 'pls') {
            return this.api.get('preferences/integrations/pls_account/sync');
        }
    }
    sendToChalkline() {
        return this.api.post('preferences/integrations/send_to_chalkline');
    }
    disconnect(service, id) {
        var serviceToDisconnect = service.toLowerCase();
        if (serviceToDisconnect === 'google') {
            return this.api.delete('preferences/integrations/google_accounts/' + id);
        }
        if (serviceToDisconnect === 'key') {
            return this.api.delete('preferences/integrations/key_accounts/' + id);
        }
        if (serviceToDisconnect === 'prayer letters') {
            return this.api.delete('preferences/integrations/prayer_letters_account');
        }
        if (serviceToDisconnect === 'pls') {
            return this.api.delete('preferences/integrations/pls_account');
        }
    }
}
export default angular.module('mpdx.preferences.integrations.service', [])
    .service('integrations', IntegrationsService).name;
