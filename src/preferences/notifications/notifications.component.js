import concat from 'lodash/fp/concat';
import find from 'lodash/fp/find';
import includes from 'lodash/fp/includes';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import uuid from 'uuid/v1';

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
    }
    $onInit() {
        this.init();
    }
    init() {
        this.notifications = reduce((result, value, key) => {
            const defaultActions = (this.setup && this.accounts.current.notification_preferences.length === 0) ? ['email', 'task'] : [''];
            const notificationType = find(pref => pref.notification_type.id === key, this.accounts.current.notification_preferences) || {id: uuid(), actions: defaultActions};
            result = concat(result, {
                id: notificationType.id,
                key: key,
                title: value,
                email: includes('email', notificationType.actions),
                task: includes('task', notificationType.actions)
            });
            return result;
        }, [], this.serverConstants.data.notifications);
    }
    save() {
        this.saving = true;
        this.accounts.current.notification_preferences = reduce((result, value) => {
            let notificationType = find({id: value.id}, this.accounts.current.notification_preferences) || {id: uuid(), notification_type: {id: value.key}, actions: []};
            notificationType.actions = [];
            if (value.email) {
                notificationType.actions = concat(notificationType.actions, 'email');
            }
            if (value.task) {
                notificationType.actions = concat(notificationType.actions, 'task');
            }
            if (!value.task && !value.email) {
                notificationType.actions = [''];
            }
            return concat(result, notificationType);
        }, [], this.notifications);
        return this.accounts.saveCurrent().then(() => {
            this.alerts.addAlert('Notifications saved successfully', 'success');
            this.onSave();
            this.saving = false;
        });
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
        onSave: '&',
        setup: '<'
    }
};

export default angular.module('mpdx.preferences.notifications.component', [])
    .component('preferencesNotifications', Notifications).name;
