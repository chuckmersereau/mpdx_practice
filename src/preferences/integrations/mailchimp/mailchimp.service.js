class mailchimpService {
    constructor(
        api
    ) {
        this.api = api;
        this.data = {};
        this.loading = true;
        this.state = 'disabled';

        this.load();
    }
    load() {
        this.loading = true;
        return this.api.get('preferences/integrations/mail_chimp_account').then((data) => {
            this.data = data.mail_chimp;
            this.updateState();
            this.loading = false;
        });
    }
    save() {
        return this.api.put('preferences/integrations/mail_chimp_account', { mail_chimp: this.data }).then((data) => {
            this.data = data.mail_chimp;
            this.updateState();
        });
    }
    sync() {
        return this.api.get('preferences/integrations/mail_chimp_account/sync');
    }
    disconnect() {
        return this.api.delete('preferences/integrations/mail_chimp_account');
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
