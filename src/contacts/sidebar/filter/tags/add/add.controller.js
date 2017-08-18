import isArray from 'lodash/fp/isArray';
import map from 'lodash/fp/map';

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
        let tagToAdd = tag || map(tag => { return { name: tag }; }, this.tags);
        if (!tagToAdd) {
            return;
        }
        if (!isArray(tagToAdd)) {
            tagToAdd = [tagToAdd];
        }
        return this.api.post({
            url: 'contacts/tags/bulk',
            data: tagToAdd,
            params: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    contact_ids: this.selectedContacts.join()
                }
            },
            type: 'tags'
        }).then(() => {
            this.$rootScope.$emit('contactTagsAdded', { tags: map('name', tagToAdd), contactIds: this.selectedContacts });
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
