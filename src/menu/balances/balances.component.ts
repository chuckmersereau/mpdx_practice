import 'angular-gettext';
import { reduce, toInteger } from 'lodash/fp';
import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import api, { ApiService } from '../../common/api/api.service';
import designationAccounts, { DesignationAccountsService } from '../../common/designationAccounts/designationAccounts.service';

class BalancesController {
    goals: any;
    title: string;
    watcher: () => void;
    constructor(
        private $filter: ng.IFilterService,
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private api: ApiService,
        private designationAccounts: DesignationAccountsService
    ) {}
    $onInit() {
        this.init();
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.init();
        });
    }
    $onDestroy() {
        this.watcher();
    }
    init(): void {
        this.goals = undefined;
        this.getGoals();
        this.getDesignationAccounts();
    }
    getDesignationAccounts(): ng.IPromise<void> {
        return this.designationAccounts.load(true);
    }
    getGoals(): ng.IPromise<void> {
        return this.api.get('reports/goal_progress', {
            filter: {
                account_list_id: this.api.account_list_id
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('reports/goal_progress', data);
            this.goals = data;
            const currency = this.accounts.current.default_currency;
            this.title = this.gettextCatalog.getString(
                `{{received}} ${currency} received/{{pledged}} ${currency} committed of goal: {{goal}} ${currency}. Click to see outstanding financial partners.`, {
                    pledged: this.$filter('currency')(this.accounts.current.total_pledges, '', 2),
                    received: this.$filter('currency')(this.goals.received_pledges, '', 2),
                    goal: this.$filter('currency')(this.accounts.current.monthly_goal, '', 2)
                }
            );
        });
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

export default angular.module('mpdx.menu.balances.component', [
    'gettext',
    accounts, api, designationAccounts
]).component('menuBalances', Balances).name;
