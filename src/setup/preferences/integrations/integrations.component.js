import indexOf from 'lodash/fp/indexOf';

class IntegrationsController {
    users;
    constructor(
        $state, users
    ) {
        this.$state = $state;
        this.users = users;

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

import users from '../../../common/users/users.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.setup.preferences.integrations.component', [
    users,
    uiRouter
]).component('setupPreferencesIntegrations', Integrations).name;