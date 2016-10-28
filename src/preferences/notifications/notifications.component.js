class NotificationPreferencesController {
    constructor(
        notificationsService, alertsService
    ) {
        this.notificationsService = notificationsService;
        this.alertsService = alertsService;
        this.saving = false;
    }
    save() {
        this.saving = true;
        return this.notificationsService.save().then(() => {
            this.alertsService.addAlert('Notifications saved successfully', 'success');
            this.saving = false;
            this.saving = false;
        }).catch((data) => {
            angular.forEach(data.errors, function(value) {
                this.alertsService.addAlert(value, 'danger');
            });
            this.saving = false;
        });
    }
}

const Notifications = {
    controller: NotificationPreferencesController,
    controllerAs: 'vm',
    template: require('./notifications.html')
};

export default angular.module('mpdx.preferences.notifications.component', [])
    .component('notificationPreferences', Notifications).name;
