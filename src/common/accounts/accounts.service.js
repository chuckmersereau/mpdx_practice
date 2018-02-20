import { assign, findIndex, get, isNil, keys, toString } from 'lodash/fp';
import createPatch from '../fp/createPatch';

class AccountsService {
    constructor(
        $log, $rootScope, $window,
        api
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.api = api;

        this.analytics = null;
        this.current = null;
        this.data = {};
        this.defaultIncludes = 'primary_appeal';
        this.defaultFields = { primary_appeal: '' };
        this.donations = null;
        this.inviteList = null;
        this.userList = null;
        this.currentInitialState = {};
    }
    get(id) {
        return this.api.get(`account_lists/${id}`, {
            include: this.defaultIncludes,
            fields: this.defaultFields
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`account_lists/${id}`, data);
            return data;
        });
    }
    swap(id, userId, reset = false) {
        if (!reset && (isNil(id) || id === get('id', this.current))) {
            return Promise.reject();
        }
        return this.get(id).then((data) => {
            this.setLocalStorage(`${userId}_accountListId`, toString(id));
            this.current = data;
            this.currentInitialState = angular.copy(this.current);
            this.api.account_list_id = id;
            /* istanbul ignore next */
            this.$log.debug('account swapped: ', id);
            this.$rootScope.$emit('accountListUpdated', this.api.account_list_id);
            return data;
        });
    }
    /* istanbul ignore next */
    setLocalStorage(key, value) {
        // abstracted for test failures
        this.$window.localStorage.setItem(key, value);
    }
    getCurrent(userId, reset = false) {
        return this.swap(this.api.account_list_id, userId, reset);
    }
    getDonations(params = {}) {
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`, params).then((resp) => {
            /* istanbul ignore next */
            this.$log.debug(`accounts.getDonations - account_lists/${this.api.account_list_id}/donations`, resp);
            this.donations = resp;
            return resp;
        });
    }
    listInvites() {
        this.inviteList = null;
        return this.api.get(`account_lists/${this.api.account_list_id}/invites`, {
            include: 'invited_by_user',
            fields: {
                contacts: 'first_name, last_name'
            },
            filter: {
                invite_user_as: 'user'
            }
        }).then((data) => {
            this.inviteList = data;
            /* istanbul ignore next */
            this.$log.debug('account_lists/invites', this.inviteList);
            return data;
        });
    }
    listUsers() {
        this.userList = null;
        return this.api.get(`account_lists/${this.api.account_list_id}/users`, {
            include: 'email_addresses',
            fields: {
                email_addresses: 'email,primary',
                users: 'email_addresses,first_name,last_name'
            },
            per_page: 100
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('account_lists/users:', data);
            this.userList = data;
        });
    }
    destroyUser(id, successMessage, errorMessage) {
        return this.api.delete(
            `account_lists/${this.api.account_list_id}/users/${id}`,
            undefined, successMessage, errorMessage
        );
    }
    listCoachesInvites() {
        this.inviteCoachList = null;
        return this.api.get(`account_lists/${this.api.account_list_id}/invites`, {
            include: 'invited_by_user',
            fields: {
                contacts: 'first_name, last_name'
            },
            filter: {
                invite_user_as: 'coach'
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('account_lists/invites', data);
            this.inviteCoachList = data;
        });
    }
    listCoaches() {
        this.coachList = null;
        return this.api.get(`account_lists/${this.api.account_list_id}/coaches`, {
            include: 'email_addresses',
            fields: {
                email_addresses: 'email,primary',
                users: 'email_addresses,first_name,last_name'
            }
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('account_lists/coaches:', data);
            this.coachList = data;
        });
    }
    destroyCoach(id, successMessage, errorMessage) {
        return this.api.delete({
            url: `account_lists/${this.api.account_list_id}/coaches/${id}`,
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    destroyInvite(id, successMessage, errorMessage) {
        return this.api.delete({
            url: `account_lists/${this.api.account_list_id}/invites/${id}`,
            type: 'account_list_invites',
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    getAnalytics(params, errorMessage) {
        return this.api.get(`account_lists/${this.api.account_list_id}/analytics`, {
            filter: {
                date_range: `${params.startDate.format('YYYY-MM-DD')}..${params.endDate.format('YYYY-MM-DD')}`
            }
        }, undefined, errorMessage).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('account_lists/analytics', data);
            this.analytics = data;
            return this.analytics;
        });
    }
    saveCurrent(successMessage, errorMessage) {
        const patch = createPatch(this.currentInitialState, this.current);
        /* istanbul ignore next */
        this.$log.debug('account patch', patch);
        return keys(patch).length < 2
            ? Promise.resolve(this.current)
            : this.api.put(`account_lists/${this.current.id}`, patch, successMessage, errorMessage).then(() => {
                this.get(this.current.id).then((data) => { // get complete due to include object diffs
                    this.current = data;
                    this.currentInitialState = angular.copy(this.current);
                    const index = findIndex({ id: data.id }, this.data); // reconcile w/ account list
                    if (index > 0) {
                        this.data[index] = assign(this.data[index], patch);
                    }
                    return this.current;
                });
            });
    }
    load(reset = false) {
        if (!reset && this.data.length > 0) {
            return Promise.resolve(this.data);
        }

        return this.api.get('account_lists', {
            include: this.defaultIncludes,
            fields: this.defaultFields
        }).then((data) => {
            this.data = data;
        });
    }
}

import api from '../api/api.service';

export default angular.module('mpdx.common.accounts.service', [
    api
]).service('accounts', AccountsService).name;
