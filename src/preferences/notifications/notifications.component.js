class NotificationPreferencesController {
    constructor(
        notificationsService, alerts
    ) {
        this.notificationsService = notificationsService;
        this.alerts = alerts;
        this.saving = false;
    }
    save() {
        this.saving = true;
        return this.notificationsService.save().then(() => {
            this.alerts.addAlert('Notifications saved successfully', 'success');
            this.saving = false;
            this.saving = false;
        }).catch((data) => {
            angular.forEach(data.errors, function(value) {
                this.alerts.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
}

const Notifications = {
    controller: NotificationPreferencesController,
    template: require('./notifications.html')
};

export default angular.module('mpdx.preferences.notifications.component', [])
    .component('notificationPreferences', Notifications).name;
