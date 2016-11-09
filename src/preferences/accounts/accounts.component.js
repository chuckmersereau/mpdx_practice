class AccountPreferencesController {
    constructor($state, $stateParams) {
        this.$state = $state;

        if ($stateParams.id) {
            this.setTab($stateParams.id);
        }
    }
    setTab(service) {
        if (service === '' || this.tabId === service) {
            this.tabId = '';
            this.$state.go('preferences.accounts', {}, { notify: false });
        } else {
            this.tabId = service;
            this.$state.go('preferences.accounts.tab', { id: service }, { notify: false });
        }
    }
    tabSelected(service) {
        return this.tabId === service;
    }
}

const Preferences = {
    controller: AccountPreferencesController,
    template: require('./accounts.html')
};

export default angular.module('mpdx.preferences.accounts.component', [])
    .component('accountPreferences', Preferences).name;
