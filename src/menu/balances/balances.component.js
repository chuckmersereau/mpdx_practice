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
        this.reports.getGoals().then((data) => {
            this.title = this.gettextCatalog.getString(
                '{{received}} received/{{pledged}} committed of goal: {{goal}}. Click to see outstanding financial partners.', {
                    pledged: data.total_pledges,
                    received: data.received_pledges,
                    goal: data.monthly_goal
                }
            );
        });
        this.designationAccounts.load().then(() => {
            this.balance = _.sum(_.map(this.designationAccounts.data, 'converted_balance'));
        });
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

export default angular.module('mpdx.menu.balances.component', [])
    .component('menuBalances', Balances).name;

