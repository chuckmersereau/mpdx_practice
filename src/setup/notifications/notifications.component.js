const SetupNotifications = {
    template: `<preferences-notifications setup="true"></preferences-notifications>`
};

export default angular.module('mpdx.setup.notifications.component', [])
    .component('setupNotifications', SetupNotifications).name;