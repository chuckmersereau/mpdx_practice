class EditController {
    constructor(
        appealId, pledge,
        $scope,
        api, locale, serverConstants
    ) {
        this.$scope = $scope;
        this.api = api;
        this.appealId = appealId;
        this.locale = locale;
        this.pledge = pledge;
        this.serverConstants = serverConstants;
        this.selectedContact = pledge.contact.name;
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
        this.pledge.contact.id = contact.id;
        this.selectedContact = contact.name;
    }
    save() {
        return this.api.put(`account_lists/${this.api.account_list_id}/pledges/${this.pledge.id}`, {
            amount: this.pledge.amount,
            amount_currency: this.pledge.commitmentCurrency,
            expected_date: this.pledge.expectedDate,
            appeal: {
                id: this.appealId
            },
            contact: {
                id: this.pledge.contactId
            }
        }).then(() => {
            this.$scope.$hide();
        });
    }
}

import api from 'common/api/api.service';
import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.appeals.show.editCommitment.controller', [
    api, locale, serverConstants
]).controller('editCommitmentController', EditController).name;