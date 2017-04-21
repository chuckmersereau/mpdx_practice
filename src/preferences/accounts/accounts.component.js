class AccountsController {
    constructor(
        $state, $stateParams, gettextCatalog,
        help
    ) {
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;

        help.suggest([
            this.gettextCatalog.getString('58d3d70ddd8c8e7f5974d3ca'),
            this.gettextCatalog.getString('57e2f280c697910d0784d307')
        ]);
    }
    $onInit() {
        if (this.$stateParams.id || this.selectedTab) {
            this.setTab(this.$stateParams.id || this.selectedTab);
        }
    }
    $onChanges(data) {
        if (data.selectedTab) {
            this.setTab(this.selectedTab);
        }
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            if (!this.selectedTab) {
                this.tabId = '';
            }
        } else {
            if (this.selectedTab) {
                if (this.tabSelectable(service)) {
                    this.tabId = service;
                }
            } else {
                this.tabId = service;
            }
        }
    }
    tabSelectable(service) {
        if (this.selectedTab) {
            return this.selectedTab === service;
        }
        return true;
    }
    tabSelected(service) {
        return this.tabId === service;
    }
}

const Accounts = {
    controller: AccountsController,
    template: require('./accounts.html'),
    bindings: {
        setup: '<',
        onSave: '&',
        selectedTab: '<'
    }
};

export default angular.module('mpdx.preferences.accounts.component', [])
    .component('preferencesAccounts', Accounts).name;
