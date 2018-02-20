import moment from 'moment';
import { find } from 'lodash/fp';

class progressController {
    constructor(
        $rootScope,
        blockUI, gettextCatalog,
        accounts, users
    ) {
        this.$rootScope = $rootScope;
        this.gettextCatalog = gettextCatalog;

        this.accounts = accounts;
        this.blockUI = blockUI.instances.get('homeProgress');
        this.users = users;

        this.endDate = moment().endOf('week');
        this.startDate = moment(this.endDate).subtract(1, 'week').add(1, 'day');
        this.errorOccurred = false;
    }
    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.refreshData();
            this.users.listOrganizationAccounts(true);
        });

        this.refreshData();
        this.users.listOrganizationAccounts();
        this.$rootScope.$on('accountListUpdated', () => {
            this.users.listOrganizationAccounts(true);
        });
    }
    nextWeek() {
        this.startDate.add(1, 'week');
        this.endDate.add(1, 'week');
        this.refreshData();
    }
    previousWeek() {
        this.startDate.subtract(1, 'week');
        this.endDate.subtract(1, 'week');
        this.refreshData();
    }
    refreshData() {
        this.blockUI.start();
        this.accounts.analytics = null;
        const errorMessage = this.gettextCatalog.getString('Unable to update Progress Report');
        return this.accounts.getAnalytics(
            { startDate: this.startDate, endDate: this.endDate },
            errorMessage
        ).then(() => {
            this.blockUI.reset();
        }).catch((err) => {
            this.blockUI.reset();
            throw err;
        });
    }
    showWeeklyProgressReport() {
        return find((organizationAccount) => organizationAccount.organization.name === 'Cru - USA', this.users.organizationAccounts);
    }
}

const Progress = {
    controller: progressController,
    template: require('./progress.html')
};

import blockUI from 'angular-block-ui';
import gettextCatalog from 'angular-gettext';
import accounts from 'common/accounts/accounts.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.home.progress.component', [
    blockUI, gettextCatalog,
    accounts, users
]).component('homeProgress', Progress).name;
