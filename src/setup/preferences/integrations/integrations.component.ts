import { indexOf } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import uiRouter from '@uirouter/angularjs';
import users, { UsersService } from '../../../common/users/users.service';

class IntegrationsController {
    selectableTabs: string[];
    selectedTab: string;
    constructor(
        private $state: StateService,
        private users: UsersService
    ) {
        this.selectableTabs = ['google', 'mailchimp', 'prayerletters'];
    }
    $onInit() {
        this.selectedTab = this.selectableTabs[0];
        this.users.currentOptions.setup_position.value = 'preferences.integrations';
        this.users.setOption(this.users.currentOptions.setup_position);
    }
    onSave() {
        this.next();
    }
    next() {
        const nextNav = indexOf(this.selectedTab, this.selectableTabs) + 1;
        if (this.selectableTabs.length === nextNav) {
            this.users.currentOptions.setup_position.value = 'finish';
            return this.users.setOption(this.users.currentOptions.setup_position).then(() => {
                this.$state.go('setup.finish');
            });
        } else {
            this.selectedTab = this.selectableTabs[nextNav];
        }
    }
}

const Integrations = {
    template: require('./integrations.html'),
    controller: IntegrationsController
};

export default angular.module('mpdx.setup.preferences.integrations.component', [
    users,
    uiRouter
]).component('setupPreferencesIntegrations', Integrations).name;