class MailchimpService {
    constructor() {
        this.data = null;
    }
}

export default angular.module('mpdx.preferences.accounts.integrations.mailchimp.service', [])
    .service('mailchimp', MailchimpService).name;
