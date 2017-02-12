class SetupNotificationsController {
    users;
    constructor(
        users
    ) {
        this.users = users;
    }
    $onInit() {
        this.users.current.options.setup_position.value = 'notifications';
        this.users.setOption(this.users.current.options.setup_position);
    }
}

const SetupNotifications = {
    template: `<preferences-notifications setup="true"></preferences-notifications>`,
    controller: SetupNotificationsController
};

export default angular.module('mpdx.setup.notifications.component', [])
    .component('setupNotifications', SetupNotifications).name;