import { get } from 'lodash/fp';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import appeals, { AppealsService } from '../../../tools/appeals/appeals.service';
import appealsShow, { AppealsShowService } from '../../../tools/appeals/show/show.service';

class AppealsController {
    appeal: any;
    count: number;
    watcher: () => void;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private accounts: AccountsService,
        private appeals: AppealsService,
        private appealsShow: AppealsShowService
    ) {
        this.count = 0;

        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.$onInit();
        });
    }
    $onInit() {
        this.appeal = null;
        const currentAccount = get('current', this.accounts);
        const primaryAppeal = get('primary_appeal', currentAccount);
        const primaryAppealId = get('id', primaryAppeal);
        return primaryAppealId
            ? this.getPrimaryAppeal(primaryAppealId)
            : null;
    }
    $onDestroy() {
        this.watcher();
    }
    getPrimaryAppeal(primaryAppealId) {
        return this.appealsShow.getAppeal(primaryAppealId).then((data) => {
            this.appeal = data;
        });
    }
}

const progressAppeals = {
    template: require('./appeals.html'),
    controller: AppealsController
};

export default angular.module('mpdx.home.progress.appeals', [
    accounts, appeals, appealsShow
]).component('progressAppeals', progressAppeals).name;
