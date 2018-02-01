import { get } from 'lodash/fp';

class AppealsController {
    constructor(
        $log, $rootScope,
        accounts, appeals, appealsShow
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.appeals = appeals;
        this.appealsShow = appealsShow;

        this.count = 0;

        $rootScope.$on('accountListUpdated', () => {
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

import accounts from 'common/accounts/accounts.service';
import appeals from 'tools/appeals/appeals.service';
import appealsShow from 'tools/appeals/show/show.service';

export default angular.module('mpdx.home.progress.appeals', [
    accounts, appeals, appealsShow
]).component('progressAppeals', progressAppeals).name;
