import { concat, defaultTo, find, reduce } from 'lodash/fp';
import * as uuid from 'uuid/v1';

class NotificationPreferencesController {
    loading: boolean;
    notificationPreferences: any;
    onSave: any;
    watcher: any;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private gettext: ng.gettext.gettextFunction,
        private api: ApiService,
        private serverConstants: ServerConstantsService,
        private users: UsersService
    ) {
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
        const errorMessage = this.gettext('Unable to load notification preferences');
        return this.api.get(
            `account_lists/${this.api.account_list_id}/notification_preferences?include=notification_type`,
            undefined, undefined, errorMessage
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
            this.loading = false;
            throw ex;
        });
    }
    save() {
        this.loading = true;
        const successMessage = this.gettext('Notifications saved successfully');
        const errorMessage = this.gettext('Unable to save changes');
        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/notification_preferences/bulk`,
            data: this.notificationPreferences,
            type: 'notification_preferences',
            fields: {
                notification_preferences: ''
            },
            errorMessage: errorMessage,
            successMessage: successMessage
        }).then(() => {
            this.onSave();
            this.loading = false;
        }).catch((ex) => {
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

import 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../../common/api/api.service';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';
import users, { UsersService } from '../../common/users/users.service';

export default angular.module('mpdx.preferences.notifications.component', [
    'gettext', uiRouter,
    api, serverConstants, users
]).component('preferencesNotifications', Notifications).name;
