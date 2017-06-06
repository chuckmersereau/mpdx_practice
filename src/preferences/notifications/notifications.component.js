import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import includes from 'lodash/fp/includes';
import reduce from 'lodash/fp/reduce';
import uuid from 'uuid/v1';

class NotificationPreferencesController {
    accounts;
    alerts;
    notifications;
    serverConstants;
    setup;
    users;

    constructor(
        $rootScope, $state, gettextCatalog,
        accounts, alerts, serverConstants, users
    ) {
        this.$state = $state;
        this.accounts = accounts;
        this.alerts = alerts;
        this.gettextCatalog = gettextCatalog;
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
        this.notifications = reduce((result, value) => {
            const defaultActions = (this.setup && this.accounts.current.notification_preferences.length === 0) ? ['email', 'task'] : [''];
            const notificationType = defaultTo({id: uuid(), actions: defaultActions}, find(pref => pref.notification_type.id === value.key, this.accounts.current.notification_preferences));
            result = concat(result, {
                id: notificationType.id,
                key: value.key,
                title: value.value,
                email: includes('email', notificationType.actions),
                task: includes('task', notificationType.actions)
            });
            return result;
        }, [], this.serverConstants.data.notification_translated_hashes);
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
            this.alerts.addAlert(this.gettextCatalog.getString('Notifications saved successfully'), 'success');
            this.onSave();
            this.saving = false;
        });
    }
    next() {
        this.users.currentOptions.setup_position.value = '';
        this.users.setOption(this.users.currentOptions.setup_position).then(() => {
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

import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.notifications.component', [
    accounts, alerts, serverConstants, users
]).component('preferencesNotifications', Notifications).name;
