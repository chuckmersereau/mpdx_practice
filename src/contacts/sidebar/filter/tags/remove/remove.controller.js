import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import union from 'lodash/fp/union';
import joinComma from 'common/fp/joinComma';
import emptyToNull from 'common/fp/emptyToNull';

class RemoveTagController {
    constructor(
        $rootScope, $scope, gettextCatalog,
        api, modal, contactsTags,
        selectedContacts, currentListSize
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;

        this.currentListSize = currentListSize;
        this.selectedContacts = selectedContacts;

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
        const params = {
            filter: {
                account_list_id: this.api.account_list_id,
                contact_ids: emptyToNull(joinComma(contactIds))
            }
        };
        const data = [{
            name: tag
        }];
        const message = this.gettextCatalog.getString('Are you sure you wish to remove the selected tag?');
        return this.modal.confirm(message).then(() => {
            return this.api.delete({ url: 'contacts/tags/bulk', params: params, data: data, type: 'tags' }).then((data) => {
                this.$rootScope.$emit('contactTagDeleted', { tag: tag, contactIds: contactIds });
                return data;
            });
        });
    }
}

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import contactsTags from '../tags.service';
import gettextCatalog from 'angular-gettext';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.contacts.sidebar.tags.remove.controller', [
    api, contacts, contactsTags, gettextCatalog, modal
]).controller('removeTagController', RemoveTagController).name;
