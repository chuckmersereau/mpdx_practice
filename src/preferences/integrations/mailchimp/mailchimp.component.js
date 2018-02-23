import config from 'config';

class MailchimpIntegrationPreferencesController {
    constructor(
        $log, $rootScope, $window, gettextCatalog,
        api, help, mailchimp, modal
    ) {
        this.$log = $log;
        this.$window = $window;
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.help = help;
        this.mailchimp = mailchimp;
        this.modal = modal;

        this.saving = false;
        this.showSettings = false;
        this.isProduction = config.env === 'production';

        $rootScope.$on('accountListUpdated', () => {
            this.mailchimp.load();
        });
    }
    $onInit() {
        this.oAuth = `${config.oAuthUrl}mailchimp?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.encodeURIComponent(config.baseUrl + 'preferences/integrations?selectedTab=mailchimp')}&access_token=${this.$window.localStorage.getItem('token')}`;
        this.mailchimp.load();
    }
    save(showSettings = false) {
        this.saving = true;
        const successMessage = this.gettextCatalog.getString('Preferences saved successfully');
        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/mail_chimp_account`,
            data: this.mailchimp.data,
            successMessage: successMessage
        }).then(() => {
            this.saving = false;
            this.showSettings = false;
            return this.mailchimp.load().then(() => {
                this.showSettings = showSettings;
            });
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    sync() {
        this.saving = true;
        const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp');
        return this.api.get(
            `account_lists/${this.api.account_list_id}/mail_chimp_account/sync`,
            undefined, undefined, errorMessage
        ).then(() => {
            this.saving = false;
            const message = this.gettextCatalog.getString('Your MailChimp sync has been started. This process may take 2-4 hours to complete.');
            this.modal.info(message);
        }).catch((err) => {
            this.saving = false;
            throw err;
        });
    }
    disconnect() {
        const msg = this.gettextCatalog.getString('Are you sure you wish to disconnect this MailChimp account?');
        return this.modal.confirm(msg).then(() => {
            this.saving = true;
            const errorMessage = this.gettextCatalog.getString('MPDX couldn\'t save your configuration changes for MailChimp');
            const successMessage = this.gettextCatalog.getString('MPDX removed your integration with MailChimp');
            return this.api.delete(
                `account_lists/${this.api.account_list_id}/mail_chimp_account`,
                undefined, successMessage, errorMessage
            ).then(() => {
                this.mailchimp.data = null;
                this.showSettings = false;
                this.saving = false;
            }).catch((err) => {
                this.saving = false;
                throw err;
            });
        });
    }
    showHelp() {
        this.help.showHelp();
    }
}

const Mailchimp = {
    controller: MailchimpIntegrationPreferencesController,
    template: require('./mailchimp.html')
};

import api from 'common/api/api.service';
import gettextCatalog from 'angular-gettext';
import mailchimp from './mailchimp.service';
import help from 'common/help/help.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.preferences.integrations.mailchimp.component', [
    gettextCatalog,
    api, mailchimp, help, modal
]).component('mailchimpIntegrationPreferences', Mailchimp).name;
