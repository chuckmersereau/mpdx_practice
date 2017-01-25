class NotificationPreferencesController {
    accounts;
    alerts;
    notifications;

    constructor(
        accounts, alerts
    ) {
        this.accounts = accounts;
        this.alerts = alerts;

        this.saving = false;
        this.notifications = _.keyBy(accounts.current.preferences_notifications, 'field_name');
    }
    save() {
        this.saving = true;
        _.each(this.accounts.current.preferences_notifications, (notification) => {
            notification.actions = this.notifications[notification.field_name].actions;
        });
        return this.accounts.saveCurrent().then((data) => {
            _.unionBy(this.accounts.data, [data], 'id');
            this.alerts.addAlert('Notifications saved successfully', 'success');
        }).catch((data) => {
            _.each(data.errors, (value) => {
                this.alerts.addAlert(value, 'danger');
            });
        }).finally(() => {
            this.saving = false;
        });
    }
    toggleNotification(fieldName, notificationType) {
        const index = this.notifications[fieldName].actions.indexOf(notificationType);
        if (index === -1) {
            this.notifications[fieldName].actions.push(notificationType);
        } else {
            this.notifications[fieldName].actions.splice(index, 1);
        }
    }
}

const Notifications = {
    controller: NotificationPreferencesController,
    template: require('./notifications.html')
};

export default angular.module('mpdx.preferences.notifications.component', [])
    .component('notificationPreferences', Notifications).name;
