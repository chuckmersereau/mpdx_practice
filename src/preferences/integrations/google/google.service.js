import config from 'config';
import find from 'lodash/fp/find';
import isObject from 'lodash/fp/isObject';

class GoogleService {
    constructor(
        $log, $window,
        api
    ) {
        this.$log = $log;
        this.$window = $window;
        this.api = api;
        this.oAuth = '';
        this.data = [];
    }
    load(reset = false) {
        if (!reset && this.data.length > 0) {
            return Promise.resolve(this.data);
        }

        this.oAuth = `${config.oAuthUrl}google?account_list_id=${this.api.account_list_id}&redirect_to=${this.$window.encodeURIComponent(config.baseUrl + 'preferences/integrations?selectedTab=google')}&access_token=${this.$window.localStorage.getItem('token')}`;
        return this.api.get('user/google_accounts', {
            sort: 'created_at',
            include: 'contact_groups'
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('user/google_accounts', data);
            this.failure = isObject(find({ token_failure: true }, data));
            this.data = data;
        });
    }
    disconnect(id) {
        return this.api.delete({ url: `user/google_accounts/${id}`, type: 'google_accounts' }).then(() => {
            return this.load(true);
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.preferences.accounts.integrations.google.service', [
    api
]).service('google', GoogleService).name;