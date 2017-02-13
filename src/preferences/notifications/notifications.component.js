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

        this.init();

        $rootScope.$on('accountListUpdated', () => {
            this.init();
        });

        this.notificationTypes = _.map(_.keys(serverConstants.data.notifications), (key) => {
            return {id: key, value: serverConstants.data.notifications[key]};
        });
    }
    init() {
        this.notifications = _.keyBy(this.accounts.current.notification_preferences, 'id');
        console.log(this.notifications);
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
    toggleNotification(e, id, notificationType) {
        console.log(e);
        console.log(id);
        const index = _.findIndex(this.notifications[id].actions, notificationType);
        if (e.target.checked && index !== null) {
            this.notifications[id].actions.push(notificationType);
        } else if (index !== null) {
            this.notifications[id].actions.splice(index, 1);
        }

        // if (index === -1) {
        //     this.notifications[fieldName].actions.push(notificationType);
        // } else {
        //     this.notifications[fieldName].actions.splice(index, 1);
        // }
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
