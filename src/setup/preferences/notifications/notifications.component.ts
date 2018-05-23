import { StateService } from '@uirouter/core';
import uiRouter from '@uirouter/angularjs';
import users, { UsersService } from '../../../common/users/users.service';

class NotificationsController {
    constructor(
        private $state: StateService,
        private users: UsersService
    ) {}
    $onInit() {
        this.users.currentOptions.setup_position.value = 'preferences.notifications';
        this.users.setOption(this.users.currentOptions.setup_position);
    }
    onSave() {
        this.next();
    }
    next() {
        this.users.currentOptions.setup_position.value = 'preferences.integrations';
        return this.users.setOption(this.users.currentOptions.setup_position).then(() => {
            this.$state.go('setup.preferences.integrations');
        });
    }
}

const Notifications = {
    template: require('./notifications.html'),
    controller: NotificationsController
};

export default angular.module('mpdx.setup.preferences.notifications.component', [
    uiRouter,
    users
]).component('setupPreferencesNotifications', Notifications).name;
