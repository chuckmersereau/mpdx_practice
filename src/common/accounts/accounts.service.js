class AccountsService {
    analytics;
    api;
    donations;

    constructor(
        $rootScope, $log, $q,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.api = api;

        this.analytics = null;
        this.current = null;
        this.data = {};
        this.donations = null;
        this.inviteList = null;
        this.userList = null;
    }
    load() {
        return this.api.get(`account_lists`).then((data) => {
            this.$log.debug('accounts:', data);
            this.data = data;
        });
    }
    swap(id) {
        if (id == null || id === _.get(this.current, 'id')) {
            return this.$q.reject();
        }
        return this.api.get(`account_lists/${id}`).then((resp) => {
            this.current = resp;
            this.api.account_list_id = id;
            this.$log.debug('account swapped: ', resp);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            return resp;
        });
    }
    getCurrent() {
        return this.swap(this.api.account_list_id);
    }
    getDonations(params) {
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`, params || {}).then((resp) => {
            this.$log.debug(`accounts.getDonations - account_lists/${this.api.account_list_id}/donations`, resp);
            this.donations = resp;
            return resp;
        });
    }
    destroyInvite(id) {
        return this.api.delete(`account_lists/${this.api.account_list_id}/invites/${id}`);
    }
    destroyUser(id) {
        return this.api.delete(`account_lists/${this.api.account_list_id}/users/${id}`);
    }
    listInvites() {
        this.inviteList = null;
        return this.api.get(`account_lists/${this.api.account_list_id}/invites`).then((data) => {
            this.inviteList = data;
            this.$log.debug('account_lists/invites', this.inviteList);
        });
    }
    listUsers() {
        this.userList = null;
        this.api.get(`account_lists/${this.api.account_list_id}/users`).then((data) => {
            this.userList = data;
            this.$log.debug('account_lists/users:', this.userList);
        });
    }
    getAnalytics(params) {
        if (this.analytics) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get(`account_lists/${this.api.account_list_id}/analytics`, { filter: { end_date: params.endDate.toISOString(), start_date: params.startDate.toISOString() } }).then((data) => {
            this.$log.debug('account_lists/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accounts', AccountsService).name;
