import * as Upload from 'ng-file-upload';
import api, { ApiService } from '../../../common/api/api.service';
import config from '../../../config';
import users, { UsersService } from '../../../common/users/users.service';

export class PreferencesOrganizationService {
    data: any;
    state: string;
    constructor(
        private $log: ng.ILogService,
        private $window: ng.IWindowService,
        private Upload: ng.angularFileUpload.IUploadService,
        private api: ApiService,
        private users: UsersService
    ) {
        this.data = {};
        this.state = 'disabled';
    }
    save(successMessage, errorMessage) {
        return this.api.put('user/organization_accounts', this.data, successMessage, errorMessage).then((data) => {
            this.data.organization_accounts = data;
            return this.updateState();
        });
    }
    disconnect(id, successMessage, errorMessage) {
        return this.api.delete({
            url: `user/organization_accounts/${id}`,
            type: 'organization_accounts',
            successMessage: successMessage,
            errorMessage: errorMessage
        });
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
    createAccount(username, password, organizationId, successMessage, errorMessage) {
        let org: any = {
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
        return this.api.post('user/organization_accounts', org, successMessage, errorMessage);
    }
    updateAccount(username, password, accountId, successMessage, errorMessage) {
        return this.api.put({
            url: `user/organization_accounts/${accountId}`,
            data: {
                id: accountId,
                username: username,
                password: password
            },
            type: 'organization_accounts',
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    import(account) {
        return this.Upload.upload({
            method: 'POST',
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

export default angular.module('mpdx.preferences.integrations.organization.service', [
    Upload,
    api, users
]).service('preferencesOrganization', PreferencesOrganizationService).name;
