import indexOf from 'lodash/fp/indexOf';

class IntegrationsController {
    users;
    constructor(
        $state, users
    ) {
        this.$state = $state;
        this.users = users;

        this.selectableTabs = ['mailchimp', 'prayerletters'];
        this.selectedTab = this.selectableTabs[0];
    }
    $onInit() {
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
            this.users.setOption(this.users.currentOptions.setup_position).then(() => {
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

export default angular.module('mpdx.setup.preferences.integrations.component', [])
    .component('setupPreferencesIntegrations', Integrations).name;