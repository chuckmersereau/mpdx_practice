import config from 'config';

class MailchimpService {
    api;

    constructor(
        $log, $q, $window,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;
        this.$window = $window;
    }
    load(reset = false) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }

        this.oAuth = `${config.oAuthUrl}mailchimp?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.encodeURIComponent(config.baseUrl + 'preferences/integrations?selectedTab=mailchimp')}&access_token=${this.$window.localStorage.getItem('token')}`;
        return this.api.get(`account_lists/${this.api.account_list_id}/mail_chimp_account`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/mail_chimp_account`, data);
            this.data = data;
        }).finally(() => {
        });
    }
    save() {
        return this.api.post({ url: `account_lists/${this.api.account_list_id}/mail_chimp_account`, data: this.data }).then((data) => {
            this.data = data;
        });
    }
    sync() {
        return this.api.get(`account_lists/${this.api.account_list_id}/mail_chimp_account`);
    }
    disconnect() {
        return this.api.delete(`account_lists/${this.api.account_list_id}/mail_chimp_account`).then(() => {
            this.data = null;
        });
    }
}

export default angular.module('mpdx.preferences.accounts.integrations.mailchimp.service', [])
    .service('mailchimp', MailchimpService).name;
