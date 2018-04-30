class AddController {
    amount: number;
    contactId: string;
    expected_date: string;
    received: boolean;
    selectedContact: string;
    constructor(
        private appealId: string,
        contact: any,
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private gettext: ng.gettext.gettextFunction,
        private api: ApiService,
        private locale: LocaleService,
        private serverConstants: ServerConstantsService
    ) {
        this.contactId = contact.id;
        this.selectedContact = contact.name;
        this.received = false;
    }
    save() {
        const status = this.received ? 'received_not_processed' : 'not_received';
        const pledge = {
            amount: this.amount,
            expected_date: this.expected_date,
            status: status,
            appeal: {
                id: this.appealId
            },
            contact: {
                id: this.contactId
            }
        };
        const successMessage = this.gettext('Successfully added commitment to appeal');
        const errorMessage = this.gettext('Unable to add commitment to appeal');
        return this.api.post(
            `account_lists/${this.api.account_list_id}/pledges`,
            pledge, successMessage, errorMessage
        ).then(() => {
            this.$rootScope.$emit('pledgeAdded', pledge);
            this.$scope.$hide();
        });
    }
}

import 'angular-gettext';
import api, { ApiService } from '../../../../common/api/api.service';
import locale, { LocaleService } from '../../../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.appeals.show.addPledge.controller', [
    'gettext',
    api, locale, serverConstants
]).controller('addPledgeController', AddController).name;