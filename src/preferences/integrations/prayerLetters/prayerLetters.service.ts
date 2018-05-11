import api, { ApiService } from '../../../common/api/api.service';
import config from '../../../config';

export class PrayerLettersService {
    data: any;
    oAuth: string;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $window: ng.IWindowService,
        private api: ApiService
    ) {
        this.$log = $log;
        this.$window = $window;
        this.api = api;
        this.oAuth = '';
        this.data = null;
    }
    load(reset = false) {
        if (!reset && this.data) {
            return this.$q.resolve(this.data);
        }
        this.oAuth = `${config.oAuthUrl}prayer_letters?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.encodeURIComponent(config.baseUrl + 'preferences/integrations?selectedTab=prayerletters')}&access_token=${this.$window.localStorage.getItem('token')}`;
        return this.api.get({
            url: `account_lists/${this.api.account_list_id}/prayer_letters_account`,
            overridePromise: true
        }).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/prayer_letters_account`, data);
            this.data = data;
        }).catch(() => {
            this.data = null;
        });
    }
    disconnect(successMessage, errorMessage) {
        return this.api.delete(
            `account_lists/${this.api.account_list_id}/prayer_letters_account`,
            undefined, successMessage, errorMessage
        ).then(() => {
            this.data = null;
        });
    }
}

export default angular.module('mpdx.preferences.accounts.integrations.prayerLetters.service', [
    api
]).service('prayerLetters', PrayerLettersService).name;
