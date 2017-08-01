import reduce from 'lodash/fp/reduce';
import toInteger from 'lodash/fp/toInteger';

class BalancesController {
    constructor(
        $log, $rootScope, gettextCatalog,
        accounts, designationAccounts, reports
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.designationAccounts = designationAccounts;
        this.gettextCatalog = gettextCatalog;
        this.reports = reports;
    }
    $onInit() {
        this.init();
        this.$rootScope.$on('accountListUpdated', () => {
            this.init(true);
        });
    }
    init(reset = false) {
        this.reports.getGoals().then(() => {
            this.title = this.gettextCatalog.getString(
                '{{received}} received/{{pledged}} committed of goal: {{goal}}. Click to see outstanding financial partners.', {
                    pledged: this.accounts.current.total_pledges,
                    received: this.reports.goals.received_pledges,
                    goal: this.accounts.current.monthly_goal
                }
            );
        });
        this.designationAccounts.load(reset).then(() => {
            this.balance = reduce((sum, designation) =>
                sum + toInteger(designation.active ? designation.converted_balance : 0)
            , 0, this.designationAccounts.data);
        });
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

import accounts from 'common/accounts/accounts.service';
import designationAccounts from 'common/designationAccounts/designationAccounts.service';
import gettextCatalog from 'angular-gettext';
import reports from 'reports/reports.service';

export default angular.module('mpdx.menu.balances.component', [
    gettextCatalog,
    accounts, designationAccounts, reports
]).component('menuBalances', Balances).name;
