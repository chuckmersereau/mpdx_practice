import api, { ApiService } from '../../common/api/api.service';
import uiRouter from '@uirouter/angularjs';

class ShowController {
    account: any[];
    loading: boolean;
    constructor(
        private $log: ng.ILogService,
        private $stateParams: any,
        private api: ApiService
    ) {
        this.loading = false;
    }
    $onInit() {
        this.load();
    }
    load() {
        this.loading = true;
        return this.api.get({
            url: `coaching/account_lists/${this.$stateParams.accountId}`,
            data: {
                include: 'users,users.email_addresses,users.phone_numbers,users.facebook_accounts,users.linkedin_accounts,users.twitter_accounts',
                fields: {
                    users: 'title,first_name,last_name,suffix,avatar,email_addresses,phone_numbers,employer,occupation,marital_status'
                }
            },
            type: 'account_lists'
        }).then((data: any) => {
            this.loading = false;
            /* istanbul ignore next */
            this.$log.debug('coaching account list', data);
            this.account = data;
        });
    }
}

const Show = {
    controller: ShowController,
    template: require('./show.html')
};

export default angular.module('mpdx.coaches.show.component', [
    uiRouter,
    api
]).component('coachesShow', Show).name;
