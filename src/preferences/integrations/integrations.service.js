class IntegrationsService {
    api;

    constructor(
        $q, $log, $rootScope,
        api
    ) {
        this.$q = $q;
        this.$log = $log;
        this.api = api;

        this.data = {};
        this.loading = true;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        this.$q.all([
            // this.api.get(`account_lists/${this.api.account_list_id}/prayer_letters_account`), //TODO: reimplement once API doesn't 404
            this.api.get(`user/google_accounts`),
            this.api.get('user/key_accounts').then((data) => {
                this.$log.debug('user/key_accounts', data);
                this.data.key_accounts = data;
            })
        ]).then(() => {
            this.loading = false;
        });
    }
    sync() {
        return this.api.get(`account_lists/${this.api.account_list_id}/prayer_letters_account/sync`);
    }
    sendToChalkline() {
        return this.api.post(`account_lists/${this.api.account_list_id}/send_to_chalkline`);
    }
    disconnect(service, id) {
        const serviceToDisconnect = service.toLowerCase();
        if (serviceToDisconnect === 'google') {
            return this.api.delete(`user/google_accounts/${id}`);
        }
        if (serviceToDisconnect === 'key') {
            return this.api.delete('user/key_accounts/' + id);
        }
        if (serviceToDisconnect === 'prayer letters') {
            return this.api.delete(`account_lists/${this.api.account_list_id}/prayer_letters_account`);
        }
    }
}
export default angular.module('mpdx.preferences.integrations.service', [])
    .service('integrations', IntegrationsService).name;
