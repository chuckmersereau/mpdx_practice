import assign from 'lodash/fp/assign';
import defaultTo from 'lodash/fp/defaultTo';
import flatten from 'lodash/fp/flatten';
import get from 'lodash/fp/get';

class SetupService {
    constructor(
        $q, $state, gettextCatalog,
        accounts, alerts, api, users
    ) {
        this.$q = $q;
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.users = users;
    }

    next() {
        return this.hasAccountLists().catch((err) => {
            this.alerts.addAlert(this.gettextCatalog.getString('Something went wrong, please try again.'), 'danger');
            throw err;
        });
    }

    hasAccountLists() {
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

    hasDefaultAccountList() {
        if (this.users.current.preferences.default_account_list === null) {
            return this.goAccount();
        } else {
            return this.hasOrganizationAccounts();
        }
    }

    hasOrganizationAccounts() {
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

    goAccount() {
        return this.setPosition('account').then(() => {
            this.$state.go('setup.account');
        });
    }

    goConnect() {
        return this.setPosition('connect').then(() => {
            this.$state.go('setup.connect');
        });
    }

    goPreferences() {
        return this.setPosition('preferences.personal').then(() => {
            this.$state.go('setup.preferences.personal');
        });
    }

    getUserOrganizationAccounts() {
        return this.users.listOrganizationAccounts(true);
    }

    getAccountListOrganizationAccounts() {
        return this.api.get(
            `account_lists/${this.users.current.preferences.default_account_list}`,
            { include: 'organization_accounts' }
        ).then((data) => {
            return data.organization_accounts;
        });
    }

    setDefaultAccountList() {
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

    setPosition(position) {
        if (get('value', this.users.currentOptions.setup_position) !== position) {
            this.users.currentOptions = assign(defaultTo({}, this.users.currentOptions), {
                setup_position: {
                    key: 'setup_position',
                    value: position
                }
            });
            return this.users.setOption(this.users.currentOptions.setup_position);
        }
        return Promise.resolve();
    }
}

import uiRouter from '@uirouter/angularjs';
import gettextCatalog from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.setup.service', [
    uiRouter, gettextCatalog,
    alerts, users
]).service('setup', SetupService).name;
