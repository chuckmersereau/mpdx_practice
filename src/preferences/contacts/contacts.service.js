class ContactsService {
    constructor($rootScope, api) {
        this.api = api;

        this.data = {};
        this.loading = false;
        this.account_list_id_watcher = $rootScope.$watch(() => {
            return api.account_list_id;
        }, () => {
            this.load();
        });

        this.load();
    }
    load() {
        this.loading = true;
        this.api.get('preferences/contacts').then((data) => {
            this.data = data.preferences;
            this.loading = false;
        });
    }
    save(success, error) {
        this.api.put('preferences',
            { preference: { contact_tabs_sort: this.data.contact_tabs_sort } }
        ).then(success).catch(error);
    }
}

export default angular.module('mpdx.services.preferences.contacts', [])
    .service('preferencesContacts', ContactsService).name;
