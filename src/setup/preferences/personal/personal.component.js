class PersonalController {
    accounts;
    alerts;
    users;
    constructor(
        $state,
        accounts, alerts, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.users = users;

        this.selectableTabs = ['locale', 'monthly_goal', 'home_country'];
        this.selectedTab = this.selectableTabs[0];
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'preferences.personal';
        this.users.setOption(this.users.current.options.setup_position);
    }
    onSave() {
        this.next();
    }
    next() {
        const nextNav = _.indexOf(this.selectableTabs, this.selectedTab) + 1;
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

export default angular.module('mpdx.setup.preferences.personal.component', [])
    .component('setupPreferencesPersonal', Personal).name;
