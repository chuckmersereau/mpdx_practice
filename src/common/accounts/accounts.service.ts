import { assign, findIndex, get, isNil, keys, toString } from 'lodash/fp';
import api, { ApiService } from '../api/api.service';
import createPatch from '../fp/createPatch';

export class AccountsService {
    analytics: any;
    coachList: any;
    current: any;
    data: any;
    defaultFields: any;
    defaultIncludes: string;
    donations: any;
    inviteCoachList: any;
    inviteList: any;
    userList: any;
    currentInitialState: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        private api: ApiService
    ) {
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
    get(id: string): ng.IPromise<any> {
        return this.api.get(`account_lists/${id}`, {
            include: this.defaultIncludes,
            fields: this.defaultFields
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug(`account_lists/${id}`, data);
            return data;
        });
    }
    swap(id?: string, userId?: string, reset: boolean = false): ng.IPromise<any> {
        if (!reset && (isNil(id) || id === get('id', this.current))) {
            return this.$q.reject({});
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
    private setLocalStorage(key: string, value: string): void {
        // abstracted for test failures
        this.$window.localStorage.setItem(key, value);
    }
    getCurrent(userId: string, reset: boolean = false): ng.IPromise<any> {
        return this.swap(this.api.account_list_id, userId, reset);
    }
    getDonations(params: any = {}): ng.IPromise<any> {
        return this.api.get(`account_lists/${this.api.account_list_id}/donations`, params).then((resp) => {
            /* istanbul ignore next */
            this.$log.debug(`accounts.getDonations - account_lists/${this.api.account_list_id}/donations`, resp);
            this.donations = resp;
            return resp;
        });
    }
    listInvites(): ng.IPromise<any> {
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
    listUsers(): ng.IPromise<any> {
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
    destroyUser(id: string, successMessage: string, errorMessage: string): ng.IPromise<any> {
        return this.api.delete(
            `account_lists/${this.api.account_list_id}/users/${id}`,
            undefined, successMessage, errorMessage
        );
    }
    listCoachesInvites(): ng.IPromise<any> {
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
    listCoaches(): ng.IPromise<any> {
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
    destroyCoach(id: string, successMessage: string, errorMessage: string): ng.IPromise<any> {
        return this.api.delete({
            url: `account_lists/${this.api.account_list_id}/coaches/${id}`,
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    destroyInvite(id: string, successMessage: string, errorMessage: string): ng.IPromise<any> {
        return this.api.delete({
            url: `account_lists/${this.api.account_list_id}/invites/${id}`,
            type: 'account_list_invites',
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    getAnalytics(params: any, errorMessage: string): ng.IPromise<any> {
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
    saveCurrent(successMessage: string, errorMessage?: string): ng.IPromise<any> {
        const patch = createPatch(this.currentInitialState, this.current);
        /* istanbul ignore next */
        this.$log.debug('account patch', patch);
        return keys(patch).length < 2
            ? this.$q.resolve(this.current)
            : this.api.put(`account_lists/${this.current.id}`, patch, successMessage, errorMessage).then(() => {
                this.get(this.current.id).then((data: any) => { // get complete due to include object diffs
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
    load(reset: boolean = false): ng.IPromise<any> {
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
        }

        return this.api.get('account_lists', {
            include: this.defaultIncludes,
            fields: this.defaultFields
        }).then((data) => {
            this.data = data;
        });
    }
}

export default angular.module('mpdx.common.accounts.service', [
    api
]).service('accounts', AccountsService).name;
