class NotificationPreferencesController {
    accounts;
    alerts;
    notifications;

    constructor(
        $rootScope,
        accounts, alerts
    ) {
        this.accounts = accounts;
        this.alerts = alerts;

        this.saving = false;

        this.init();

        $rootScope.$on('accountListUpdated', () => {
            this.init();
        });

        console.error('preferences/notifications: TODO: constants from API');
        this.notificationTypes = [
            {type: 'NotificationType::SpecialGift', description: 'Partner gave a Special Gift'},
            {type: 'NotificationType::StoppedGiving', description: 'Partner missed a gift'},
            {type: 'NotificationType::StartedGiving', description: 'Partner started giving'},
            {type: 'NotificationType::SmallerGift', description: 'Partner gave less than commitment'},
            {type: 'NotificationType::RecontinuingGift', description: 'Partner recontinued giving'},
            {type: 'NotificationType::LongTimeFrameGift', description: 'Partner gave with commitment of semi-annual or more'},
            {type: 'NotificationType::LargerGift', description: 'Partner gave a larger gift than commitment'},
            {type: 'NotificationType::CallPartnerOncePerYear', description: 'Partner have not had an attempted call logged in the past year'},
            {type: 'NotificationType::ThankPartnerOncePerYear', description: 'Partner have not had a thank you note logged in the past year'}
        ];
    }
    init() {
        this.notifications = _.keyBy(this.accounts.current.notification_preferences, 'type');
    }
    save() {
        this.saving = true;
        _.each(this.accounts.current.notification_preferences, (notification) => {
            notification.actions = this.notifications[notification.type].actions;
        });
        return this.accounts.saveCurrent().then(() => {
            this.alerts.addAlert('Notifications saved successfully', 'success');
            return this.accounts.getCurrent();
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
