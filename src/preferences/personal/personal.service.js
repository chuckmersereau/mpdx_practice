class PersonalService {
    api;

    constructor(
        api, gettextCatalog
    ) {
        this.api = api;
        this.gettextCatalog = gettextCatalog;

        this.data = {};
        this.loading = true;

        //TODO: figure out if this is needed in api v2 (don't think it is)
        // $rootScope.$on('accountListUpdated', () => {
        //     this.load();
        // });
    }
    load() {
        this.loading = true;
        return this.api.get('preferences/personal').then((data) => {
            this.data = data.preferences;
            if (this.data.locale) {
                this.changeLocale(this.data.locale);
            }
            this.loading = false;
        });
    }
    save() {
        return this.api.put('preferences', { preference: this.data });
    }

}

export default angular.module('mpdx.preferences.personal.service', [])
    .service('personalService', PersonalService).name;
