class NotificationsController {
    users;
    constructor(
        $state, users
    ) {
        this.$state = $state;
        this.users = users;
    }
    $onInit() {
        this.users.currentOptions.setup_position.value = 'preferences.notifications';
        this.users.setOption(this.users.currentOptions.setup_position);
    }
    onSave() {
        this.next();
    }
    next() {
        this.users.currentOptions.setup_position.value = 'preferences.integrations';
        this.users.setOption(this.users.currentOptions.setup_position).then(() => {
            this.$state.go('setup.preferences.integrations');
        });
    }
}

const Notifications = {
    template: require('./notifications.html'),
    controller: NotificationsController
};

export default angular.module('mpdx.setup.preferences.notifications.component', [])
    .component('setupPreferencesNotifications', Notifications).name;
