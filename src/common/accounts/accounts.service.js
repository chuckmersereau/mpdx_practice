import assign from 'lodash/fp/assign';
import findIndex from 'lodash/fp/findIndex';
import get from 'lodash/fp/get';
import keys from 'lodash/fp/keys';
import toString from 'lodash/fp/toString';
import createPatch from "../fp/createPatch";

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
        this.defaultIncludes = 'notification_preferences,notification_preferences.notification_type';
        this.donations = null;
        this.inviteList = null;
        this.userList = null;
        this.currentInitialState = {};
    }
    get(id) {
        return this.api.get(`account_lists/${id}`, { include: this.defaultIncludes }).then((data) => {
            this.$log.debug(`account_lists/${id}`, data);
            return data;
        });
    }
    swap(id, userId, reset = false) {
        if (!reset && (id == null || id === get('id', this.current))) {
            return this.$q.reject();
        }
        return this.get(id).then((data) => {
            this.$window.localStorage.setItem(`${userId}_accountListId`, toString(id));
            this.current = data;
            this.currentInitialState = angular.copy(this.current);
            this.api.account_list_id = id;
            this.$log.debug('account swapped: ', id);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            return data;
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
        return this.api.delete({url: `account_lists/${this.api.account_list_id}/invites/${id}`, type: 'account_list_invites'});
    }
    destroyUser(id) {
        return this.api.delete(`account_lists/${this.api.account_list_id}/users/${id}`);
    }
    listInvites() {
        this.inviteList = null;
        return this.api.get(`account_lists/${this.api.account_list_id}/invites`, {
            include: 'invited_by_user',
            fields: {
                contacts: 'first_name, last_name'
            }
        }).then((data) => {
            this.inviteList = data;
            this.$log.debug('account_lists/invites', this.inviteList);
        });
    }
    listUsers() {
        this.userList = null;
        this.api.get(`account_lists/${this.api.account_list_id}/users`, {
            include: 'email_addresses',
            fields: {
                email_addresses: 'email,primary',
                users: 'email_addresses,first_name,last_name'
            }
        }).then((data) => {
            this.$log.debug('account_lists/users:', data);
            this.userList = data;
        });
    }
    getAnalytics(params) {
        return this.api.get(`account_lists/${this.api.account_list_id}/analytics`, { filter: { date_range: `${params.startDate.format('YYYY-MM-DD')}..${params.endDate.format('YYYY-MM-DD')}` } }).then((data) => {
            this.$log.debug('account_lists/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    saveCurrent() {
        const patch = createPatch(this.currentInitialState, this.current);
        this.$log.debug('account patch', patch);
        if (keys(patch).length < 2) {
            return this.$q.resolve(this.current);
        }
        return this.api.put(`account_lists/${this.current.id}`, patch).then(() => {
            this.get(this.current.id).then((data) => { //get complete due to include object diffs
                this.current = data;
                this.currentInitialState = angular.copy(this.current);
                const index = findIndex({id: data.id}, this.data); //reconcile w/ account list
                if (index > 0) {
                    this.data[index] = assign(this.data[index], patch);
                }
                return this.current;
            });
        });
    }
    load(reset = false) {
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
        }

        return this.api.get('account_lists', { include: this.defaultIncludes }).then((data) => {
            this.data = data;
        });
    }
}
export default angular.module('mpdx.common.accounts.service', [])
    .service('accounts', AccountsService).name;
