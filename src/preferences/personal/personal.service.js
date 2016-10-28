class PersonalService {
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
        return this.api.get('preferences/personal').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    save() {
        return this.api.put('preferences', { preference: this.data });
    }
}

export default angular.module('mpdx.preferences.personal.service', [])
    .service('personalService', PersonalService).name;
