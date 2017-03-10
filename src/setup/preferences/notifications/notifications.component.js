class NotificationsController {
    users;
    constructor(
        $state, users
    ) {
        this.$state = $state;
        this.users = users;
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'preferences.notifications';
        this.users.setOption(this.users.current.options.setup_position);
    }
    onSave() {
        this.next();
    }
    next() {
        this.users.current.options.setup_position.value = 'finish';
        this.users.setOption(this.users.current.options.setup_position).then(() => {
            this.$state.go('setup.finish');
        });
    }
}

const Notifications = {
    template: require('./notifications.html'),
    controller: NotificationsController
};

export default angular.module('mpdx.setup.preferences.notifications.component', [])
    .component('setupPreferencesNotifications', Notifications).name;
