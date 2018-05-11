import { find, isObject } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';
import config from '../../../config';

export class GoogleService {
    data: any;
    failure: boolean;
    oAuth: string;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $window: ng.IWindowService,
        private api: ApiService
    ) {
        this.oAuth = '';
        this.data = [];
    }
    load(reset = false) {
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
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
    disconnect(id, successMessage, errorMessage) {
        return this.api.delete({
            url: `user/google_accounts/${id}`,
            type: 'google_accounts',
            successMessage: successMessage,
            errorMessage: errorMessage
        }).then(() => {
            return this.load(true);
        });
    }
}

export default angular.module('mpdx.preferences.accounts.integrations.google.service', [
    api
]).service('google', GoogleService).name;