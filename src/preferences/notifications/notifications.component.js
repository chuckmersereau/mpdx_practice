class NotificationPreferencesController {
    accounts;
    alerts;
    notifications;
    serverConstants;
    setup;

    constructor(
        $rootScope, $state,
        accounts, alerts, serverConstants
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.serverConstants = serverConstants;

        this.saving = false;

        this.init();

        $rootScope.$on('accountListUpdated', () => {
            this.init();
        });

        console.error('preferences/notifications: TODO: FIX constants from API');
        this.notificationTypes = _.map(_.keys(serverConstants.data.notifications), (key) => {
            return {id: key, value: serverConstants.data.notifications[key]};
        });
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
            return this.accounts.getCurrent().then(() => {
                if (this.setup) {
                    this.next();
                }
            });
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
    next() {
        this.$state.go('setup.google');
    }
}

const Notifications = {
    controller: NotificationPreferencesController,
    template: require('./notifications.html'),
    bindings: {
        setup: '<'
    }
};

export default angular.module('mpdx.preferences.notifications.component', [])
    .component('preferencesNotifications', Notifications).name;
