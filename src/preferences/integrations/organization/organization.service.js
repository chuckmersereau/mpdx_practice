class OrganizationService {
    api;
    state;

    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;
        this.data = {};
        this.state = 'disabled';
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
            organization: {
                id: organizationId
            }
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
