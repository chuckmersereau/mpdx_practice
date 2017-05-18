class IntegrationsService {
    api;

    constructor(
        $q, $log,
        api
    ) {
        this.$q = $q;
        this.$log = $log;
        this.api = api;

        this.data = {};
        this.loading = true;
    }
    load() {
        this.loading = true;
        this.data.valid_prayer_letters_account = null;
        this.api.get('user/key_accounts').then((data) => {
            this.$log.debug('user/key_accounts', data);
            this.data.key_accounts = data;
        }).then(() => {
            this.loading = false;
        });
    }
    sendToChalkline() {
        return this.api.post(`account_lists/${this.api.account_list_id}/chalkline_mail`);
    }
    disconnect(service, id) {
        const serviceToDisconnect = service.toLowerCase();
        if (serviceToDisconnect === 'key') {
            return this.api.delete('user/key_accounts/' + id);
        }
    }
}

import api from '../../common/api/api.service';

export default angular.module('mpdx.preferences.integrations.service', [
    api
]).service('integrations', IntegrationsService).name;
