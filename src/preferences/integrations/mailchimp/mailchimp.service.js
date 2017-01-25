class mailchimpService {
    api;

    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = null;
        this.state = 'disabled';
    }
    load() {
        return this.api.get(`account_lists/${this.api.account_list_id}/mail_chimp_account`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/mail_chimp_account`, data);
            this.data = data;
            this.updateState();
        });
    }
    save() {
        return this.api.put(`account_lists/${this.api.account_list_id}/mail_chimp_account`, this.data).then((data) => {
            this.data = data;
            this.updateState();
        });
    }
    sync() {
        return this.api.get(`account_lists/${this.api.account_list_id}/mail_chimp_account`);
    }
    disconnect() {
        return this.api.delete(`account_lists/${this.api.account_list_id}/mail_chimp_account`);
    }
    updateState() {
        if (this.data.active) {
            if (this.data.valid) {
                this.state = 'enabled';
            } else {
                this.state = 'error';
            }
        } else {
            this.state = 'disabled';
        }
    }
}

export default angular.module('mpdx.preferences.accounts.integrations.mailchimp.service', [])
    .service('mailchimp', mailchimpService).name;
