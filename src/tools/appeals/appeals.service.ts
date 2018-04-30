import { find } from 'lodash/fp';

export class AppealsService {
    constructor(
        private gettext: ng.gettext.gettextFunction,
        private accounts: AccountsService,
        private api: ApiService,
        private modal: ModalService
    ) {}
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
    findContactRef(appealId, contactId) {
        return this.api.get(`appeals/${appealId}/appeal_contacts`, {
            per_page: 1000,
            include: 'contact',
            filter: {
                pledged_to_appeal: false
            },
            fields: {
                contact: ''
            }
        }).then((data) => {
            return find((ref) => ref.contact.id === contactId, data);
        });
    }
    removeContact(appealId, contactId) {
        const successMessage = this.gettext('Contact removed from appeal');
        const errorMessage = this.gettext('Unable to remove contact from appeal');
        return this.findContactRef(appealId, contactId).then((contactRef) => {
            if (contactRef) {
                return this.api.delete(
                    `appeals/${appealId}/appeal_contacts/${contactRef.id}`,
                    undefined, successMessage, errorMessage
                );
            }
        });
    }
    removePledge(id) {
        const successMessage = this.gettext('Successfully removed commitment from appeal');
        const errorMessage = this.gettext('Unable to remove commitment from appeal');
        return this.api.delete(
            `account_lists/${this.api.account_list_id}/pledges/${id}`,
            undefined, successMessage, errorMessage
        );
    }
    setPrimaryAppeal(appeal) {
        this.accounts.current.primary_appeal = { id: appeal.id };
        const successMessage = this.gettext('Appeal successfully set to primary');
        const errorMessage = this.gettext('Unable to set Appeal as primary');
        return this.accounts.saveCurrent(successMessage, errorMessage);
    }
}

import 'angular-gettext';
import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import api, { ApiService } from '../../common/api/api.service';
import modal, { ModalService } from '../../common/modal/modal.service';

export default angular.module('mpdx.tools.appeals.service', [
    'gettext',
    accounts, api, modal
]).service('appeals', AppealsService).name;