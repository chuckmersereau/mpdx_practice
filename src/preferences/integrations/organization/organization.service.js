class OrganizationService {
    api;
    state;
    users;

    constructor(
        $log,
        api, users
    ) {
        this.$log = $log;
        this.api = api;
        this.users = users;

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
        if (username) {
            org.username = username;
        }
        if (password) {
            org.password = password;
        }
        return this.api.post(`user/organization_accounts`, org);
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
