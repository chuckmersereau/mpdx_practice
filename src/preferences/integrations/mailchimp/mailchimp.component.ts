import 'angular-gettext';
import api, { ApiService } from '../../../common/api/api.service';
import config from '../../../config';
import help, { HelpService } from '../../../common/help/help.service';
import mailchimp, { MailchimpService } from './mailchimp.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

class MailchimpIntegrationPreferencesController {
    oAuth: string;
    saving: boolean;
    showSettings: boolean;
    watcher: () => void;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private help: HelpService,
        private mailchimp: MailchimpService,
        private modal: ModalService
    ) {
        this.saving = false;
        this.showSettings = false;

        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.mailchimp.load();
        });
    }
    $onInit() {
        this.oAuth = `${config.oAuthUrl}mailchimp?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.encodeURIComponent(config.baseUrl + 'preferences/integrations?selectedTab=mailchimp')}&access_token=${this.$window.localStorage.getItem('token')}`;
        this.mailchimp.load();
    }
    $onDestroy() {
        this.watcher();
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
                const message = this.gettextCatalog.getString('Your MailChimp sync has been started. This process may take up to 4 hours to complete.');
                this.modal.info(message);
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
            const message = this.gettextCatalog.getString('Your MailChimp sync has been started. This process may take up to 4 hours to complete.');
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

export default angular.module('mpdx.preferences.integrations.mailchimp.component', [
    'gettext',
    api, help, mailchimp, modal
]).component('mailchimpIntegrationPreferences', Mailchimp).name;
