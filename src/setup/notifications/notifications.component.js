class SetupNotificationsController {
    constructor(
        users
    ) {
        users.current.options.setup_position.value = 'notifications';
        users.setOption(users.current.options.setup_position);
    }
}

const SetupNotifications = {
    template: `<preferences-notifications setup="true"></preferences-notifications>`,
    controller: SetupNotificationsController
};

export default angular.module('mpdx.setup.notifications.component', [])
    .component('setupNotifications', SetupNotifications).name;