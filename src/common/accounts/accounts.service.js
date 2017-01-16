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
    getDonations() {
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`).then((resp) => {
            this.donations = resp;
        }).catch((err) => {
            this.$log.debug(err);
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
    getAnalytics() {
        if (this.analytics) {
            return this.$q.resolve(this.analytics);
        }
        console.log(this.api);
        return this.api.get(`account_lists/144b83e8-b7f6-48c8-9c0e-688785bf6164/analytics`, { filter: { end_date: moment().toISOString(), start_date: moment().subtract(1, 'week').toISOString() } }).then((data) => {
            this.$log.debug('account_lists/analytics', data);
            this.analytics = data;
            return this.analytics;
        }).catch((err) => {
            this.$log.error('contacts/analytics not implemented.', err);
        });
    }
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accounts', AccountsService).name;
