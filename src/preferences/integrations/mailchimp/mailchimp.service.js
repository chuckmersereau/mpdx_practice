class mailchimpService {
    api;

    constructor(
        $log, $q, $rootScope,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.api = api;
        this.state = 'disabled';

        this.$rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });

        this.load(true);
    }
    load(reset = false) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }

        return this.api.get(`account_lists/${this.api.account_list_id}/mail_chimp_account`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/mail_chimp_account`, data);
            this.data = data;
        }).finally(() => {
            this.updateState();
        });
    }
    save() {
        return this.api.post({ url: `account_lists/${this.api.account_list_id}/mail_chimp_account`, data: this.data }).then((data) => {
            this.data = data;
        }).finally(() => {
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
        if (this.data && this.data.active) {
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
