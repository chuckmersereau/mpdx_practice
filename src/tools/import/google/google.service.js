import map from 'lodash/fp/map';

class ImportGoogleService {
    api;

    constructor(
        $log, $rootScope,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.data = null;
        this.selected_account = null;
        this.google_contact_import = null;

        this.default_google_contact_import = {
            source: 'google',
            source_account_id: null,
            import_by_group: 'false',
            override: 'false',
            groups: [],
            group_tags: {},
            tags: []
        };

        $rootScope.$watch(() => this.selectedAccountUpdated(this.selected_account));
    }

    load() {
        return this.api.get('user/google_accounts').then((data) => {
            this.$log.debug('user/google_accounts', data);
            this.data = data;
            if (this.data.length === 1) {
                this.selected_account = this.data[0];
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
                    data.group_tags[key] = map('text', data.group_tags[key]);
                }
            }
            data.tags = map('text', data.tags);
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

import api from 'common/api/api.service';

export default angular.module('mpdx.tools.import.google.service', [
    api
]).service('importGoogle', ImportGoogleService).name;
