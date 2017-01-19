class OrganizationService {
    api;
    state;

    constructor(
        $log, $rootScope,
        api
    ) {
        this.$log = $log;
        this.api = api;
        this.data = {};
        this.loading = true;
        this.state = 'disabled';
    }
    activate() {
        this.load();
        this.loadOrganizations();
    }
    load() {
        this.loading = true;
        return this.api.get(`user/organization_accounts`).then((data) => {
            this.$log.debug(`user/organization_accounts`, data);
            this.data.organization_accounts = data;
            this.updateState();
            this.loading = false;
        });
    }
    save() {
        this.api.put(`user/organization_accounts`, this.data).then((data) => {
            this.data.organization_accounts = data;
            return this.updateState();
        });
    }
    disconnect(id) {
        return this.api.delete(`user/organization_accounts/${id}`);
    }
    loadOrganizations() {
        return this.api.get('preferences/integrations/organizations').then((data) => {
            this.data.organizations = data;
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
        return this.api.post(`user/organization_accounts`, {
            username: username,
            password: password,
            organization_id: organizationId
        });
    }
    updateAccount(username, password, accountId) {
        return this.api.put(`user/organization_accounts/${accountId}`, {
            username: username,
            password: password
        });
    }
}

export default angular.module('mpdx.preferences.integrations.organization.service', [])
    .service('preferencesOrganization', OrganizationService).name;
