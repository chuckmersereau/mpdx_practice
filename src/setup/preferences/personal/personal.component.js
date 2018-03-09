import { indexOf } from 'lodash/fp';

class PersonalController {
    constructor(
        $state,
        accounts, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.users = users;

        this.selectableTabs = ['locale', 'monthly_goal', 'home_country'];
        this.selectedTab = this.selectableTabs[0];
    }
    $onInit() {
        this.users.currentOptions.setup_position.value = 'preferences.personal';
        this.users.setOption(this.users.currentOptions.setup_position);
    }
    onSave() {
        this.next();
    }
    next() {
        const nextNav = indexOf(this.selectedTab, this.selectableTabs) + 1;
        if (this.selectableTabs.length === nextNav) {
            this.$state.go('setup.preferences.notifications');
        } else {
            this.selectedTab = this.selectableTabs[nextNav];
        }
    }
}

const Personal = {
    template: require('./personal.html'),
    controller: PersonalController
};

import accounts from 'common/accounts/accounts.service';
import uiRouter from '@uirouter/angularjs';
import users from 'common/users/users.service';

export default angular.module('mpdx.setup.preferences.personal.component', [
    accounts, users,
    uiRouter
]).component('setupPreferencesPersonal', Personal).name;
