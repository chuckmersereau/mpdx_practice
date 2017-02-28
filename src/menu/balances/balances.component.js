import map from 'lodash/fp/map';
import sum from 'lodash/fp/sum';

class BalancesController {
    accounts;
    api;
    designationAccounts;
    reports;
    constructor(
        $log, $rootScope, gettextCatalog,
        accounts, api, designationAccounts, reports
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.api = api;
        this.designationAccounts = designationAccounts;
        this.gettextCatalog = gettextCatalog;
        this.reports = reports;
    }
    $onInit() {
        this.init();
        this.$rootScope.$on('accountListUpdated', () => {
            this.init();
        });
    }
    init() {
        this.reports.getGoals().then(() => {
            this.title = this.gettextCatalog.getString(
                '{{received}} received/{{pledged}} committed of goal: {{goal}}. Click to see outstanding financial partners.', {
                    pledged: this.accounts.current.total_pledges,
                    received: this.reports.goals.received_pledges,
                    goal: this.accounts.current.monthly_goal
                }
            );
        });
        this.designationAccounts.load(true).then(() => {
            const balances = map(acct => acct.converted_balance, this.designationAccounts.data);
            this.balance = sum(balances);
        });
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

export default angular.module('mpdx.menu.balances.component', [])
    .component('menuBalances', Balances).name;

