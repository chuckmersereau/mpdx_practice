import isArray from 'lodash/fp/isArray';
import joinComma from "../../../../common/fp/joinComma";

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
        this.tags = '';
    }
    save(tag) {
        let tagToAdd = tag || this.tags;
        if (!tagToAdd) {
            return;
        }
        let newTags;
        if (isArray(tagToAdd)) {
            newTags = angular.copy(tagToAdd);
            tagToAdd = joinComma(tagToAdd);
        } else {
            newTags = [tagToAdd];
        }
        return this.contactsTags.tagContact(this.selectedContacts, tagToAdd).then(() => {
            this.$rootScope.$emit('contactTagsAdded', {tags: newTags, contactIds: this.selectedContacts});
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
