import config from 'config';

class OrganizationService {
    constructor(
        $log, $window,
        Upload,
        api, users
    ) {
        this.$log = $log;
        this.$window = $window;

        this.Upload = Upload;

        this.api = api;
        this.users = users;

        this.data = {};
        this.state = 'disabled';
    }
    save() {
        this.api.put('user/organization_accounts', this.data).then((data) => {
            this.data.organization_accounts = data;
            return this.updateState();
        });
    }
    disconnect(id) {
        return this.api.delete({ url: `user/organization_accounts/${id}`, type: 'organization_accounts' });
    }
    updateState() {
        if (this.data.active) {
            if (this.data.valid) {
                this.state = 'enabled';
            } else {
                this.state = 'error';
            }
        } else {
            this.state = 'disabled';
        }
    }
    createAccount(username, password, organizationId) {
        let org = {
            organization: {
                id: organizationId
            },
            person: {
                id: this.users.current.id
            }
        };
        if (username && username.length > 0) {
            org.username = username;
        }
        if (password && password.length > 0) {
            org.password = password;
        }
        return this.api.post('user/organization_accounts', org);
    }
    updateAccount(username, password, accountId) {
        return this.api.put({
            url: `user/organization_accounts/${accountId}`,
            data: {
                id: accountId,
                username: username,
                password: password
            },
            type: 'organization_accounts'
        });
    }
    import(account) {
        return this.Upload.upload({
            url: `${config.apiUrl}account_lists/${this.api.account_list_id}/imports/tnt_data_sync`,
            data: {
                data: {
                    type: 'imports',
                    attributes: {
                        file: account.file
                    },
                    relationships: {
                        source_account: {
                            data: {
                                id: account.id,
                                type: 'organization_accounts'
                            }
                        }
                    }
                }
            }
        });
    }
    oAuth(organizationId, route = 'preferences/integrations?selectedTab=organization') {
        const redirectUrl
            = this.$window.encodeURIComponent(config.baseUrl + route);
        const token = this.$window.localStorage.getItem('token');
        const accountListId = this.api.account_list_id;
        return `${config.oAuthUrl}donorhub?account_list_id=${accountListId}`
                + `&redirect_to=${redirectUrl}`
                + `&access_token=${token}`
                + `&organization_id=${organizationId}`;
    }
}

import Upload from 'ng-file-upload';
import api from 'common/api/api.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.integrations.organization.service', [
    Upload,
    api, users
]).service('preferencesOrganization', OrganizationService).name;
