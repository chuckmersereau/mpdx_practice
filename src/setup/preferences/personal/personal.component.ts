import { indexOf } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import uiRouter from '@uirouter/angularjs';
import users, { UsersService } from '../../../common/users/users.service';

class PersonalController {
    selectableTabs: string[];
    selectedTab: string;
    constructor(
        private $state: StateService,
        private accounts: AccountsService,
        private users: UsersService
    ) {
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

export default angular.module('mpdx.setup.preferences.personal.component', [
    accounts, users,
    uiRouter
]).component('setupPreferencesPersonal', Personal).name;
