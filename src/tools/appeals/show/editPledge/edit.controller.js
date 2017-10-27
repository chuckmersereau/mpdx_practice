class EditController {
    constructor(
        appealId, pledge,
        $rootScope, $scope,
        api, locale, serverConstants
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.appealId = appealId;
        this.locale = locale;
        this.pledge = pledge;
        this.serverConstants = serverConstants;

        this.selectedContact = pledge.contact.name;
        this.received = pledge.status === 'received_not_processed';
    }
    save() {
        const status = this.received
            ? 'received_not_processed'
            : 'not_received';
        return this.api.put(`account_lists/${this.api.account_list_id}/pledges/${this.pledge.id}`, {
            id: this.pledge.id,
            amount: this.pledge.amount,
            expected_date: this.pledge.expected_date,
            status: status,
            appeal: {
                id: this.appealId
            },
            contact: {
                id: this.pledge.contactId
            }
        }).then(() => {
            this.$rootScope.$emit('pledgeAdded');
            this.$scope.$hide();
        });
    }
}

import api from 'common/api/api.service';
import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.appeals.show.editPledge.controller', [
    api, locale, serverConstants
]).controller('editPledgeController', EditController).name;