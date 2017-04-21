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
        this.data.valid_prayer_letters_account = null;
        this.$q.all([
            this.api.get(`user/google_accounts`).then((data) => {
                this.$log.debug('user/google_accounts', data);
                this.data.google_accounts = data;
            }),
            this.api.get('user/key_accounts').then((data) => {
                this.$log.debug('user/key_accounts', data);
                this.data.key_accounts = data;
            })
        ]).then(() => {
            this.loading = false;
        });
    }
    sendToChalkline() {
        return this.api.post(`account_lists/${this.api.account_list_id}/chalkline_mail`);
    }
    disconnect(service, id) {
        const serviceToDisconnect = service.toLowerCase();
        if (serviceToDisconnect === 'google') {
            return this.api.delete(`user/google_accounts/${id}`);
        }
        if (serviceToDisconnect === 'key') {
            return this.api.delete('user/key_accounts/' + id);
        }
    }
}
export default angular.module('mpdx.preferences.integrations.service', [])
    .service('integrations', IntegrationsService).name;
