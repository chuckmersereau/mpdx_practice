import { map } from 'lodash/fp';

class AddTagController {
    tags: any[];
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private api: ApiService,
        private contactsTags: ContactsTagsService,
        private contacts: ContactsService,
        private selectedContacts: string[]
    ) {
        this.tags = [];
    }
    save(tag) {
        const tagToAdd = tag ? [tag] : this.tags;
        if (!tagToAdd) {
            return;
        }

        return this.api.post({
            url: 'contacts/tags/bulk',
            data: {
                data: map((tag) => ({
                    data: {
                        type: 'tags',
                        attributes: { name: tag }
                    }
                }), tagToAdd),
                filter: {
                    account_list_id: this.api.account_list_id,
                    contact_ids: this.selectedContacts.join()
                },
                fields: {
                    contacts: ''
                }
            },
            doSerialization: false,
            autoParams: false
        }).then(() => {
            const tag = { tags: tagToAdd, contactIds: this.selectedContacts };
            this.$rootScope.$emit('contactTagsAdded', tag);
            this.contactsTags.addTag(tag);
            this.$scope.$hide();
        });
    }
}

import api, { ApiService } from '../../../../../common/api/api.service';
import contacts, { ContactsService } from '../../../../contacts.service';
import contactsTags, { ContactsTagsService } from '../tags.service';

export default angular.module('mpdxApp.contacts.sidebar.tags.add.controller', [
    api, contacts, contactsTags
]).controller('addTagController', AddTagController).name;
