import { StateService } from '@uirouter/core';
import { UsersService } from '../../common/users/users.service';

class SidebarController {
    disabled: boolean;
    constructor(
        private $state: StateService,
        private users: UsersService
    ) {}
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
