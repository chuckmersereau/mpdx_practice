class NotificationsService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.data = {};
        this.loading = true;

        $rootScope.$on('accountListUpdated', () => {
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

    save() {
        return this.api.put('put', 'preferences', { preference: this.data });
    }
}

export default angular.module('mpdx.preferences.notifications.service', [])
    .service('notifications', NotificationsService).name;
