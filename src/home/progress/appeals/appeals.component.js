import get from 'lodash/fp/get';

class AppealsController {
    constructor(
        $log, $rootScope,
        accounts, appealsShow
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.appealsShow = appealsShow;

        this.count = 0;

        $rootScope.$on('accountListUpdated', () => {
            this.$onInit();
        });
    }
    $onInit() {
        const primaryAppealId = get('id', this.accounts.current.primary_appeal);
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
import appealsShow from 'tools/appeals/show/show.service';

export default angular.module('mpdx.home.progress.appeals', [
    accounts, appealsShow
]).component('progressAppeals', progressAppeals).name;
