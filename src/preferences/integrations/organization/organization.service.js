class OrganizationService {
    api;
    state;

    constructor(
        $rootScope, api
    ) {
        this.api = api;
        this.data = {};
        this.loading = true;
        this.state = 'disabled';

        // this.activate();

        $rootScope.$on('accountListUpdated', () => {
            this.activate();
        });
    }
    activate() {
        this.load();
        this.loadOrganizations();
    }
    load() {
        this.loading = true;
        return this.api.get('preferences/integrations/organization_accounts').then((data) => {
            this.data.organization_accounts = data.organization_accounts;
            this.updateState();
            this.loading = false;
        });
    }
    save() {
        this.api.put('preferences/integrations/organization_account', { organization: this.data }).then((data) => {
            this.data.organization_accounts = data.organizations;
            return this.updateState();
        });
    }
    disconnect(id) {
        return this.api.delete('preferences/integrations/organization_accounts/' + id);
    }
    loadOrganizations() {
        return this.api.get('preferences/integrations/organizations').then((data) => {
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
    createAccount(username, password, organizationId) {
        return this.api.post('preferences/integrations/organization_accounts', {
            organization_account: {
                username: username,
                password: password,
                organization_id: organizationId
            }
        });
    }
    updateAccount(username, password, accountId) {
        return this.api.put('preferences/integrations/organization_accounts/' + accountId, {
            organization_account: {
                username: username,
                password: password
            }
        });
    }
}

export default angular.module('mpdx.preferences.integrations.organization.service', [])
    .service('preferencesOrganization', OrganizationService).name;
