import api, { ApiService } from '../../common/api/api.service';

export class IntegrationsService {
    data: any;
    loading: boolean;
    constructor(
        private $q: ng.IQProvider,
        private $log: ng.ILogService,
        private api: ApiService
    ) {
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
}

export default angular.module('mpdx.preferences.integrations.service', [
    api
]).service('integrations', IntegrationsService).name;
