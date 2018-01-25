import { map } from 'lodash/fp';

class AddTagController {
    constructor(
        $rootScope, $scope,
        api, contactsTags, contacts,
        selectedContacts
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.selectedContacts = selectedContacts;

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

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import contactsTags from '../tags.service';

export default angular.module('mpdxApp.contacts.sidebar.tags.add.controller', [
    api, contacts, contactsTags
]).controller('addTagController', AddTagController).name;
