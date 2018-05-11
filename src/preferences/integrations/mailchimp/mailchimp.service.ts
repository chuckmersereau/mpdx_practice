import api, { ApiService } from '../../../common/api/api.service';

export class MailchimpService {
    data: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private api: ApiService
    ) {
        this.data = null;
    }
    load() {
        return this.api.get({
            url: `account_lists/${this.api.account_list_id}/mail_chimp_account`,
            overridePromise: true
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`account_lists/${this.api.account_list_id}/mail_chimp_account`, data);
            this.data = data;
        }).catch(() => {
            this.data = null;
            return this.$q.resolve(); // to keep route resolution from failing
        });
    }
}

export default angular.module('mpdx.preferences.accounts.integrations.mailchimp.service', [
    api
]).service('mailchimp', MailchimpService).name;
