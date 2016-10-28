class NotificationsService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.data = {};
        this.loading = true;

        this.load();

        $rootScope.$watch(() => api.account_list_id, () => {
            this.load();
        });
    }
    load() {
        this.loading = true;
        return this.api.get('preferences/notifications').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
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
    .service('notificationsService', NotificationsService).name;
