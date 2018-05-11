import 'angular-gettext';
import { map, reduce, union } from 'lodash/fp';
import api, { ApiService } from '../../../../../common/api/api.service';
import contacts from '../../../../contacts.service';
import contactsTags, { ContactsTagsService } from '../tags.service';
import emptyToNull from '../../../../../common/fp/emptyToNull';
import joinComma from '../../../../../common/fp/joinComma';
import modal, { ModalService } from '../../../../../common/modal/modal.service';

class RemoveTagController {
    tags: any[];
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private modal: ModalService,
        private contactsTags: ContactsTagsService,
        private selectedContacts: any[],
        private currentListSize: number
    ) {
        this.tags = this.getTagsFromSelectedContacts();
    }
    removeTag(tag) {
        const contactIds = map('id', this.selectedContacts);
        return this.untagContact(contactIds, tag).then(() => {
            this.$rootScope.$emit('contactCreated');
            this.$scope.$hide();
        });
    }
    getTagsFromSelectedContacts() {
        // if more selected than data, use contactTags
        if (this.selectedContacts.length > this.currentListSize) {
            return map('name', this.contactsTags.data);
        }
        return reduce((result, contact) =>
            union(result, contact.tag_list)
            , [], this.selectedContacts).sort();
    }
    untagContact(contactIds, tag) {
        const message = this.gettextCatalog.getString('Are you sure you wish to remove the selected tag?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete({
                url: 'contacts/tags/bulk',
                data: {
                    data: [{
                        data: {
                            type: 'tags',
                            attributes: {
                                name: tag
                            }
                        }
                    }],
                    filter: {
                        account_list_id: this.api.account_list_id,
                        contact_ids: emptyToNull(joinComma(contactIds))
                    },
                    fields: {
                        contacts: ''
                    }
                },
                doSerialization: false,
                autoParams: false
            }).then((data) => {
                this.$rootScope.$emit('contactTagDeleted', { tag: tag, contactIds: contactIds });
                return data;
            });
        });
    }
}

export default angular.module('mpdx.contacts.sidebar.tags.remove.controller', [
    'gettext',
    api, contacts, contactsTags, modal
]).controller('removeTagController', RemoveTagController).name;
