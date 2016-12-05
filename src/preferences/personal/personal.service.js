import config from 'config';

class PersonalService {
    api;

    constructor(
        $rootScope,
        api, gettextCatalog
    ) {
        this.api = api;
        this.gettextCatalog = gettextCatalog;

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
            if (this.data.locale) {
                this.changeLocale(this.data.locale);
            }
            this.loading = false;
        });
    }
    save() {
        return this.api.put('preferences', { preference: this.data });
    }
    changeLocale(locale) {
        this.gettextCatalog.setCurrentLanguage(locale);
        if (config.env !== 'development' && locale !== 'en') {
            this.gettextCatalog.loadRemote(`locale/${locale}.json`);
        }
    }
}

export default angular.module('mpdx.preferences.personal.service', [])
    .service('personalService', PersonalService).name;
