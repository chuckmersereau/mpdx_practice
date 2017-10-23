class AddController {
    constructor(
        appealId, contact,
        $rootScope, $scope,
        api, locale, serverConstants
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.appealId = appealId;
        this.locale = locale;
        this.serverConstants = serverConstants;

        this.contactId = contact.id;
        this.selectedContact = contact.name;
        this.received = false;
    }
    save() {
        const status = this.received ? 'received_not_processed' : 'not_received';
        const pledge = {
            amount: this.amount,
            expected_date: this.expected_date,
            amount_currency: 'USD', // dead but required api field
            status: status,
            appeal: {
                id: this.appealId
            },
            contact: {
                id: this.contactId
            }
        };
        return this.api.post(`account_lists/${this.api.account_list_id}/pledges`, pledge).then(() => {
            this.$rootScope.$emit('pledgeAdded', pledge);
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