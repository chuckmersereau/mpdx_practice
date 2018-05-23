import 'angular-block-ui';
import 'angular-gettext';
import * as moment from 'moment';
import { find } from 'lodash/fp';
import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import users, { UsersService } from '../../common/users/users.service';

class ProgressController {
    blockUI: IBlockUIService;
    endDate: moment.Moment;
    errorOccurred: boolean;
    startDate: moment.Moment;
    constructor(
        private $rootScope: ng.IRootScopeService,
        blockUI: IBlockUIService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private users: UsersService
    ) {
        this.blockUI = blockUI.instances.get('homeProgress');

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
    controller: ProgressController,
    template: require('./progress.html')
};

export default angular.module('mpdx.home.progress.component', [
    'blockUI', 'gettext',
    accounts, users
]).component('homeProgress', Progress).name;
