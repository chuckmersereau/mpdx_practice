class NotificationPreferencesController {
    accounts;
    alerts;
    notifications;

    constructor(
        blockUI,
        accounts, alerts
    ) {
        this.accounts = accounts;
        this.alerts = alerts;

        this.saving = false;

        this.notifications = _.keyBy(accounts.current.preferences_notifications, 'field_name');

        this.notificationTypes = [
            {field_name: 'special_gift', description: 'Partner gave a Special Gift'},
            {field_name: 'stopped_giving', description: 'Partner missed a gift'},
            {field_name: 'started_giving', description: 'Partner started giving'},
            {field_name: 'smaller_gift', description: 'Partner gave less than commitment'},
            {field_name: 'recontinuing_gift', description: 'Partner recontinued giving'},
            {field_name: 'long_time_frame_gift', description: 'Partner gave with commitment of semi-annual or more'},
            {field_name: 'larger_gift', description: 'Partner gave a larger gift than commitment'},
            {field_name: 'call_partner_once_per_year', description: 'Partner have not had an attempted call logged in the past year'},
            {field_name: 'thank_partner_once_per_year', description: 'Partner have not had a thank you note logged in the past year'}
        ];
    }
    $onInit() {
        // this.blockUI.start();
        // this.notifications.load().then(() => {
        //     this.blockUI.stop();
        // });
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
