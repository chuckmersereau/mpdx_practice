class BalancesController {
    currentAccountList;

    constructor(currentAccountList, gettextCatalog) {
        this.currentAccountList = currentAccountList;
        this.gettextCatalog = gettextCatalog;
    }
}

const Balances = {
    controller: BalancesController,
    template: require('./balances.html')
};

export default angular.module('mpdx.menu.balances.component', [])
    .component('menuBalances', Balances).name;

