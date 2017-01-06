class NotificationPreferencesController {
    alerts;
    notifications;

    constructor(
        blockUI,
        notifications, alerts
    ) {
        this.notifications = notifications;
        this.alerts = alerts;

        this.blockUI = blockUI.instances.get('preferenceNotification');
        this.saving = false;

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
