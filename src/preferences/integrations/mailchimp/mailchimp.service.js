class MailchimpService {
    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = null;
    }
    load() {
        return this.api.get(`account_lists/${this.api.account_list_id}/mail_chimp_account`).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`account_lists/${this.api.account_list_id}/mail_chimp_account`, data);
            this.data = data;
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.preferences.accounts.integrations.mailchimp.service', [
    api
]).service('mailchimp', MailchimpService).name;
