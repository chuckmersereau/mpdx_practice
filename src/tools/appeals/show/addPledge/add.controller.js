class AddController {
    constructor(
        appealId,
        $scope,
        api, locale, serverConstants
    ) {
        this.$scope = $scope;
        this.api = api;
        this.appealId = appealId;
        this.locale = locale;
        this.serverConstants = serverConstants;
    }
    contactSearch(keyword) {
        // api missing exclude capability
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    appeal: this.appealId,
                    account_list_id: this.api.account_list_id,
                    wildcard_search: keyword
                },
                fields: {
                    contacts: 'name'
                },
                per_page: 6,
                sort: 'name'
            },
            overrideGetAsPost: true
        });
    }
    onContactSelected(contact) {
        this.contactId = contact.id;
        this.selectedContact = contact.name;
    }
    save() {
        return this.api.post(`account_lists/${this.api.account_list_id}/pledges`, {
            amount: this.amount,
            amount_currency: this.currency,
            expected_date: this.expected_date,
            appeal: {
                id: this.appealId
            },
            contact: {
                id: this.contactId
            }
        }).then(() => {
            this.$scope.$hide();
        });
    }
}

import api from 'common/api/api.service';
import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.appeals.show.addPledge.controller', [
    api, locale, serverConstants
]).controller('addPledgeController', AddController).name;