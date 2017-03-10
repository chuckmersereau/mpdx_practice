class SidebarController {
    constructor($state, accounts) {
        this.$state = $state;
        this.accounts = accounts;
    }
    go(state) {
        if (!this.disabled) {
            this.$state.go(state);
        }
    }
}

const Sidebar = {
    controller: SidebarController,
    template: require('./sidebar.html'),
    bindings: {
        disabled: '<'
    }
};

export default angular.module('mpdx.preferences.sidebar.component', [])
    .component('preferencesSidebar', Sidebar).name;
