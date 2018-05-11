import 'angular-gettext';
import api, { ApiService } from '../../../../common/api/api.service';
import locale, { LocaleService } from '../../../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

class EditController {
    received: boolean;
    selectedContact: string;
    constructor(
        private appealId: string,
        private pledge: any,
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private gettext: ng.gettext.gettextFunction,
        private api: ApiService,
        private locale: LocaleService,
        private serverConstants: ServerConstantsService
    ) {
        this.selectedContact = pledge.contact.name;
        this.received = pledge.status === 'received_not_processed';
    }
    save() {
        const status = this.received
            ? 'received_not_processed'
            : 'not_received';
        const successMessage = this.gettext('Successfully edited commitment');
        const errorMessage = this.gettext('Unable to edit commitment');

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
        }, successMessage, errorMessage).then(() => {
            this.$rootScope.$emit('pledgeAdded');
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.tools.appeals.show.editPledge.controller', [
    'gettext',
    api, locale, serverConstants
]).controller('editPledgeController', EditController).name;