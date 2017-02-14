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
    swap(id, reset = false) {
        if (!reset && (id == null || id === _.get(this.current, 'id'))) {
            return this.$q.reject();
        }
        return this.api.get(`account_lists/${id}`, { include: 'notification_preferences' }).then((resp) => {
            this.current = resp;
            this.api.account_list_id = id;
            this.$log.debug('account swapped: ', resp);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            return resp;
        });
    }
    getCurrent(reset = false) {
        return this.swap(this.api.account_list_id, reset);
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
        return this.api.get(`account_lists/${this.api.account_list_id}/invites`, {include: 'invited_by_user'}).then((data) => {
            this.inviteList = data;
            this.$log.debug('account_lists/invites', this.inviteList);
        });
    }
    listUsers() {
        this.userList = null;
        this.api.get(`account_lists/${this.api.account_list_id}/users`, {include: 'email_addresses'}).then((data) => {
            this.$log.debug('account_lists/users:', data);
            this.userList = data;
        });
    }
    getAnalytics(params) {
        return this.api.get(`account_lists/${this.api.account_list_id}/analytics`, { filter: { end_date: params.endDate.toISOString(), start_date: params.startDate.toISOString() } }).then((data) => {
            this.$log.debug('account_lists/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    saveCurrent() {
        return this.api.put(`account_lists/${this.current.id}`, this.current).then(() => {
            return this.getCurrent(true).then((data) => { //reconcile obj with db
                let account = _.find(this.data, { id: data.id }); //reconcile w/ account list
                if (account) {
                    _.assign(account, account, data);
                }
                return data;
            });
        });
    }
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accounts', AccountsService).name;
