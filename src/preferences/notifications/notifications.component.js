import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import reduce from 'lodash/fp/reduce';
import uuid from 'uuid/v1';

class NotificationPreferencesController {
    constructor(
        $rootScope,
        $state, gettext,
        alerts, api, serverConstants, users
    ) {
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.alerts = alerts;
        this.api = api;
        this.gettext = gettext;
        this.serverConstants = serverConstants;
        this.users = users;

        this.notificationPreferences = [];
        this.loading = false;
    }

    $onInit() {
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
        this.load();
    }

    $onDestroy() {
        this.watcher();
    }

    load() {
        this.loading = true;
        return this.api.get(
            `account_lists/${this.api.account_list_id}/notification_preferences?include=notification_type`
        ).then((data) => {
            this.notificationPreferences = reduce((result, notification) => {
                const notificationPreference = defaultTo({}, find((object) => {
                    return object.notification_type.id === notification.key;
                }, data));
                return concat(result, {
                    id: defaultTo(uuid(), notificationPreference.id),
                    notification_type: { id: notification.key },
                    title: notification.value,
                    email: defaultTo(true, notificationPreference.email),
                    task: defaultTo(true, notificationPreference.task),
                    override: true
                });
            }, [], this.serverConstants.data.notification_translated_hashes);
            this.loading = false;
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to load notification preferences'), 'danger');
            this.loading = false;
            throw ex;
        });
    }

    save() {
        this.loading = true;
        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/notification_preferences/bulk`,
            data: this.notificationPreferences,
            type: 'notification_preferences'
        }).then(() => {
            this.alerts.addAlert(this.gettext('Notifications saved successfully'), 'success');
            this.onSave();
            this.loading = false;
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to save changes'), 'danger');
            this.loading = false;
            throw ex;
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

import gettext from 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.notifications.component', [
    gettext, uiRouter,
    alerts, api, serverConstants, users
]).component('preferencesNotifications', Notifications).name;
