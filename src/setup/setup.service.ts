import 'angular-gettext';
import { assign, defaultTo, flatten, get } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import accounts, { AccountsService } from '../common/accounts/accounts.service';
import alerts, { AlertsService } from '../common/alerts/alerts.service';
import api, { ApiService } from '../common/api/api.service';
import uiRouter from '@uirouter/angularjs';
import users, { UsersService } from '../common/users/users.service';

export class SetupService {
    constructor(
        private $q: ng.IQService,
        private $state: StateService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private alerts: AlertsService,
        private api: ApiService,
        private users: UsersService
    ) {}
    next(): ng.IPromise<any> {
        return this.hasAccountLists().catch((err) => {
            this.alerts.addAlert(this.gettextCatalog.getString('Something went wrong, please try again.'), 'danger');
            throw err;
        });
    }
    private hasAccountLists(): ng.IPromise<any> {
        return this.users.getCurrent(true).then(() => {
            if (this.users.current.account_lists.length === 0) {
                if (this.$state.includes('setup.connect')) {
                    this.alerts.addAlert(this.gettextCatalog.getString(
                        'Something went wrong, please try removing your organization accounts and add them again.'
                    ), 'danger');
                } else {
                    return this.goConnect();
                }
            } else if (this.users.current.account_lists.length === 1) {
                return this.setDefaultAccountList();
            } else {
                return this.hasDefaultAccountList();
            }
        });
    }
    private hasDefaultAccountList(): ng.IPromise<any> {
        if (this.users.current.preferences.default_account_list === null) {
            return this.goAccount();
        } else {
            return this.hasOrganizationAccounts();
        }
    }
    private hasOrganizationAccounts(): ng.IPromise<void> {
        return this.$q.all([
            this.getAccountListOrganizationAccounts(),
            this.getUserOrganizationAccounts()
        ]).then((data) => {
            if (flatten(data).length > 0) {
                return this.goPreferences();
            } else {
                return this.goConnect();
            }
        });
    }
    private goAccount(): ng.IPromise<void> {
        return this.setPosition('account').then(() => {
            this.$state.go('setup.account');
        });
    }
    private goConnect(): ng.IPromise<void> {
        return this.setPosition('connect').then(() => {
            this.$state.go('setup.connect');
        });
    }
    private goPreferences(): ng.IPromise<void> {
        return this.setPosition('preferences.personal').then(() => {
            this.$state.go('setup.preferences.personal');
        });
    }
    private getUserOrganizationAccounts(): ng.IPromise<any> {
        return this.users.listOrganizationAccounts(true);
    }
    private getAccountListOrganizationAccounts(): ng.IPromise<any> {
        return this.api.get(
            `account_lists/${this.users.current.preferences.default_account_list}`,
            { include: 'organization_accounts' }
        ).then((data: any) => {
            return data.organization_accounts;
        });
    }
    private setDefaultAccountList(): ng.IPromise<any> {
        this.users.current.preferences.default_account_list = this.users.current.account_lists[0].id;
        return this.users.saveCurrent().then(() => {
            return this.accounts.swap(
                this.users.current.preferences.default_account_list,
                this.users.current.id,
                true
            ).then(() => {
                return this.hasOrganizationAccounts();
            });
        });
    }
    setPosition(position: string): ng.IPromise<any> {
        if (get('value', this.users.currentOptions.setup_position) !== position) {
            this.users.currentOptions = assign(defaultTo({}, this.users.currentOptions), {
                setup_position: {
                    key: 'setup_position',
                    value: position
                }
            });
            return this.users.setOption(this.users.currentOptions.setup_position);
        }
        return this.$q.resolve();
    }
}

export default angular.module('mpdx.setup.service', [
    uiRouter, 'gettext',
    accounts, alerts, api, users
]).service('setup', SetupService).name;
