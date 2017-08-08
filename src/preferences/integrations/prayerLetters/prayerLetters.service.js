import config from 'config';

class PrayerLettersService {
    constructor(
        $log, $window,
        api
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
        this.api.get(`account_lists/${this.api.account_list_id}/prayer_letters_account`).then((data) => {
            this.$log.debug(`account_lists/${this.api.account_list_id}/prayer_letters_account`, data);
            this.data = data;
        }, () => {
            this.data = null;
        });
    }
    sync() {
        return this.api.get(`account_lists/${this.api.account_list_id}/prayer_letters_account/sync`);
    }
    disconnect() {
        return this.api.delete(`account_lists/${this.api.account_list_id}/prayer_letters_account`).then(() => {
            this.data = null;
            this.updateState();
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.preferences.accounts.integrations.prayerLetters.service', [
    api
]).service('prayerLetters', PrayerLettersService).name;
