class NotificationsService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        // static until (if) exposed in api v2. (captured from api v1 /preferences/notifications)
        this.data = {
            special_gift: {"actions": ["email", "task", ""]},
            stopped_giving: {"actions": ["email", "task", ""]},
            started_giving: {"actions": ["email", "task", ""]},
            smaller_gift: {"actions": ["email", "task", ""]},
            recontinuing_gift: {"actions": ["email", "task", ""]},
            long_time_frame_gift: {"actions": ["email", "task", ""]},
            larger_gift: {"actions": ["email", "task", ""]},
            call_partner_once_per_year: {"actions": [null, null, ""]},
            thank_partner_once_per_year: {"actions": [null, null, ""]}
        };

        // $rootScope.$on('accountListUpdated', () => {
        //     this.load();
        // });
    }
    load() {
        // return this.api.get('preferences/notifications').then((data) => {
        //     this.data = data.preferences;
        // });
    }
    toggleNotification(fieldName, notificationType) {
        const index = this.data[fieldName].actions.indexOf(notificationType);
        if (index === -1) {
            this.data[fieldName].actions.push(notificationType);
        } else {
            this.data[fieldName].actions.splice(index, 1);
        }
    }
    save() {
        return this.api.put('put', 'preferences', { preference: this.data });
    }
}

export default angular.module('mpdx.preferences.notifications.service', [])
    .service('notifications', NotificationsService).name;
