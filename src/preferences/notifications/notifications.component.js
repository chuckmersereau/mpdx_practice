class NotificationPreferencesController {
    alerts;
    notifications;

    constructor(
        notifications, alerts
    ) {
        this.notifications = notifications;
        this.alerts = alerts;
        this.saving = false;
    }
    save() {
        this.saving = true;
        return this.notifications.save().then(() => {
            this.alerts.addAlert('Notifications saved successfully', 'success');
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
        }).finally(() => {
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
