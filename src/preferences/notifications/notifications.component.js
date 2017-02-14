class NotificationPreferencesController {
    accounts;
    alerts;
    notifications;
    serverConstants;
    setup;
    users;

    constructor(
        $rootScope, $state,
        accounts, alerts, serverConstants, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.serverConstants = serverConstants;
        this.users = users;

        this.saving = false;

        $rootScope.$on('accountListUpdated', () => {
            this.init();
        });

        this.notificationTypes = _.map(_.keys(serverConstants.data.notifications), (key) => {
            return {id: key, value: serverConstants.data.notifications[key]};
        });
    }
    save() {
        this.saving = true;
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
    toggleNotification(e, id, notificationType) {
        let notification = _.find(this.accounts.current.notification_preferences, {id: id});
        if (!notification) {
            this.accounts.current.notification_preferences.push({id: id, actions: []});
            notification = _.last(this.accounts.current.notification_preferences);
        }
        if (e.target.checked) {
            notification.actions.push(notificationType);
        } else {
            notification.actions = _.reject(notification.actions, notificationType);
        }
    }
    next() {
        this.users.current.options.setup_position.value = '';
        this.users.setOption(this.users.current.options.setup_position).then(() => {
            this.$state.go('home');
        });
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
