class BalancesController {
    currentAccountList;

    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

export default angular.module('mpdx.menu.balances.component', [])
    .component('menuBalances', Balances).name;

