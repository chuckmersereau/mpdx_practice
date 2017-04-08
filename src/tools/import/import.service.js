import map from 'lodash/fp/map';

class ImportsService {
    api;

    constructor(
        $log, $rootScope,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = null;
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

        $rootScope.$watch(() => this.selected_account, this.selectedAccountUpdated.bind(this));
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
                    data.group_tags[key] = map('text', data.group_tags[key]);
                }
            }
            data.tags = map(text, data.tags);
            return this.api.post('user/google_accounts', data).then(() => {
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
