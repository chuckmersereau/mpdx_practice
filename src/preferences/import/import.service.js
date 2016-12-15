class ImportsService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;

        this.data = {};
        this.loading = true;
        this.default_google_contact_import = {
            source: 'google',
            source_account_id: null,
            import_by_group: 'false',
            override: 'false',
            groups: [],
            group_tags: {},
            tags: []
        };
        this.google_contact_import = null;
        this.selected_account = null;

        this.load();

        this.selected_account_watcher = $rootScope.$watch(() => this.selected_account, this.selectedAccountUpdated.bind(this));
    }
    load() {
        this.loading = true;
        return this.api.get('preferences/imports').then((data) => {
            this.data = data.preferences;
            this.loading = false;
            if (this.data.google_accounts.length === 1) {
                this.selected_account = this.data.google_accounts[0];
                this.selectedAccountUpdated(this.selected_account);
            }
        });
    }
    selectedAccountUpdated(account) {
        this.google_contact_import = angular.copy(this.default_google_contact_import);
        if (angular.isDefined(account) && account !== null) {
            this.google_contact_import.source_account_id = account.id;
            angular.forEach(account.contact_groups, (group) => {
                this.google_contact_import.group_tags[group.id] = [{ text: group.tag }];
            });
        }
    }
    saveGoogleImport() {
        const data = angular.copy(this.google_contact_import);
        if (angular.isDefined(data) && data !== null) {
            for (let key in data.group_tags) {
                if (data.group_tags.hasOwnProperty(key)) {
                    data.group_tags[key] = data.group_tags[key].map(tagArr => tagArr.text);
                }
            }
            data.tags = data.tags.map(tag => tag.text);
            return this.api.post('preferences/imports', { import: data }).then(() => {
                this.selected_account = null;
                if (this.data.google_accounts.length === 1) {
                    this.selected_account = this.data.google_accounts[0];
                    this.selectedAccountUpdated(this.selected_account);
                }
                this.selectedAccountUpdated(this.selected_account);
            });
        }
    }
}

export default angular.module('mpdx.preferences.import.service', [])
    .service('preferencesImports', ImportsService).name;
