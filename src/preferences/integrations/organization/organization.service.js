class OrganizationService {
    api;

    constructor(
        $rootScope, api
    ) {
        this.api = api;
        this.data = {};
        this.loading = true;
        this.state = 'disabled';

        this.activate();

        this.account_list_id = api.account_list_id;

        this.account_list_id_watcher = $rootScope.$watch(() => api.account_list_id, () => {
            this.account_list_id = api.account_list_id;
            this.load();
        });
    }
    activate() {
        this.load();
        this.loadOrganizations();
    }
    load() {
        this.loading = true;
        this.api.get('preferences/integrations/organization_accounts').then((data) => {
            this.data.organization_accounts = data.organization_accounts;
            this.updateState();
            this.loading = false;
        });
    }
    save(success, error) {
        this.api.put('preferences/integrations/organization_account', { organization: this.data }).then((data) => {
            this.data.organization_accounts = data.organizations;
            this.updateState();
            success(data);
        }).catch(error);
    }
    disconnect(id, success, error) {
        this.api.delete('preferences/integrations/organization_accounts/' + id).then(success).catch(error);
    }
    loadOrganizations() {
        this.api.get('preferences/integrations/organizations').then((data) => {
            this.data.organizations = data.organizations;
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
    createAccount(username, password, organizationId, success, error) {
        this.api.post('preferences/integrations/organization_accounts', {
            organization_account: {
                username: username,
                password: password,
                organization_id: organizationId
            }
        }).then(success).catch(error);
    }
    updateAccount(username, password, accountId, success, error) {
        this.api.put('preferences/integrations/organization_accounts/' + accountId, {
            organization_account: { username: username,
            password: password }
        }).then(success).catch(error);
    }
}

export default angular.module('mpdx.preferences.integrations.organization.service', [])
    .service('organizationService', OrganizationService).name;
