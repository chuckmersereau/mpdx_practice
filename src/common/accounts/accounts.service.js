import assign from 'lodash/fp/assign';
import findIndex from 'lodash/fp/findIndex';
import get from 'lodash/fp/get';
import toString from 'lodash/fp/toString';

class AccountsService {
    analytics;
    api;
    donations;

    constructor(
        $log, $q, $rootScope, $window,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.api = api;

        this.analytics = null;
        this.current = null;
        this.data = {};
        this.defaultIncludes = 'notification_preferences';
        this.donations = null;
        this.inviteList = null;
        this.userList = null;
    }
    swap(id, userId, reset = false) {
        if (!reset && (id == null || id === get('id', this.current))) {
            return this.$q.reject();
        }
        return this.api.get(`account_lists/${id}`, { include: this.defaultIncludes }).then((resp) => {
            this.$window.sessionStorage.setItem(`${userId}_accountListId`, toString(id));
            this.current = resp;
            this.api.account_list_id = id;
            this.$log.debug('account swapped: ', resp);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            return resp;
        });
    }
    getCurrent(userId, reset = false) {
        return this.swap(this.api.account_list_id, userId, reset);
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
        return this.api.get(`account_lists/${this.api.account_list_id}/analytics`, { filter: { date_range: `${params.endDate.format('YYYY-MM-DD')}..${params.startDate.format('YYYY-MM-DD')}` } }).then((data) => {
            this.$log.debug('account_lists/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    saveCurrent() {
        return this.api.put(`account_lists/${this.current.id}`, this.current).then(() => {
            return this.getCurrent(true).then((data) => { //reconcile obj with db
                const index = findIndex({id: data.id}, this.data); //reconcile w/ account list
                if (index > 0) {
                    this.data[index] = assign({}, this.data[index], data);
                }
                return this.current;
            });
        });
    }
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accounts', AccountsService).name;
