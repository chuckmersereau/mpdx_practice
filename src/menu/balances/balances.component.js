class BalancesController {
    currentAccountList;

    constructor(gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
    }
    $onChanges(obj) {
        if (obj.monthlyGoal) {
            this.title = this.gettextCatalog.getString(
                '{{received}} received/{{pledged}} committed of goal: {{goal}}. Click to see outstanding financial partners.', {
                    pledged: this.totalPledges,
                    received: this.receivedPledges,
                    goal: this.monthlyGoal
                }
            );
        }
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html'),
    bindings: {
        inHandPercent: '<',
        monthlyGoal: '<',
        pledgedPercent: '<',
        receivedPledges: '<',
        totalPledges: '<'
    }
};

export default angular.module('mpdx.menu.balances.component', [])
    .component('menuBalances', Balances).name;

