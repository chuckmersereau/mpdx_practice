class BalancesController {
    accounts;
    api;
    constructor(
        $log, $rootScope, gettextCatalog,
        accounts, api
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.api = api;
        this.gettextCatalog = gettextCatalog;

        this.balances = null;
        this.goals = null;
    }
    $onInit() {
        this.init();
        this.$rootScope.$on('accountListUpdated', () => {
            this.init();
        });
    }
    init() {
        this.api.get('reports/goal_progress', {filter: {account_list_id: this.api.account_list_id}}).then((data) => {
            this.$log.debug('reports/goal_progress', data);
            this.goals = data;
            this.title = this.gettextCatalog.getString(
                '{{received}} received/{{pledged}} committed of goal: {{goal}}. Click to see outstanding financial partners.', {
                    pledged: this.goals.total_pledges,
                    received: this.goals.received_pledges,
                    goal: this.goals.monthly_goal
                }
            );
        });
        this.api.get('reports/balances', {filter: {account_list_id: this.api.account_list_id}, include: 'designation_accounts'}).then((data) => {
            this.$log.debug('reports/account_balances', data);
            this.balances = data;
            this.balance = _.sum(_.map(data.designation_accounts, 'converted_balance'));
        });
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

export default angular.module('mpdx.menu.balances.component', [])
    .component('menuBalances', Balances).name;

