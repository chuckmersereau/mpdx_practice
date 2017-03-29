import isArray from 'lodash/fp/isArray';
import map from "lodash/fp/map";
// import uuid from 'uuid/v1';

class AddTagController {
    contacts;
    contactsTags;
    selectedContacts;

    constructor(
        $rootScope, $scope,
        contactsTags, contacts,
        selectedContacts
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
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
        return this.contactsTags.tagContact(this.selectedContacts, tagToAdd).then(() => {
            this.$rootScope.$emit('contactTagsAdded', {tags: map('name', tagToAdd), contactIds: this.selectedContacts});
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
