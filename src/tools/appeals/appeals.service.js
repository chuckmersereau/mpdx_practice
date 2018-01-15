class Appeals {
    constructor(
        gettext,
        accounts, alerts, api
    ) {
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.gettext = gettext;
    }
    appealSearch(keyword) {
        return this.api.get({
            url: 'appeals',
            data: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    wildcard_search: keyword
                },
                fields: {
                    appeals: 'name'
                },
                per_page: 6
            },
            overrideGetAsPost: true
        });
    }
    setPrimaryAppeal(appeal) {
        this.accounts.current.primary_appeal = { id: appeal.id };
        return this.accounts.saveCurrent().then(() => {
            this.alerts.addAlert(this.gettext('Appeal successfully set to primary'));
        }).catch((ex) => {
            this.alerts.addAlert(this.gettext('Unable to set Appeal as primary'), 'danger');
            throw ex;
        });
    }
}

import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import gettext from 'angular-gettext';

export default angular.module('mpdx.tools.appeals.service', [
    gettext,
    accounts, alerts
]).service('appeals', Appeals).name;