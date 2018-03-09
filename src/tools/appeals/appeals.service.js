class Appeals {
    constructor(
        gettext,
        accounts, api
    ) {
        this.accounts = accounts;
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
        const successMessage = this.gettext('Appeal successfully set to primary');
        const errorMessage = this.gettext('Unable to set Appeal as primary');
        return this.accounts.saveCurrent(successMessage, errorMessage);
    }
}

import accounts from 'common/accounts/accounts.service';
import gettext from 'angular-gettext';

export default angular.module('mpdx.tools.appeals.service', [
    gettext,
    accounts
]).service('appeals', Appeals).name;