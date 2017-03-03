import isArray from 'lodash/fp/isArray';
import joinComma from "../../../../common/fp/joinComma";

class AddTagController {
    contacts;
    contactsTags;
    selectedContacts;

    constructor(
        $scope,
        contactsTags, contacts,
        selectedContacts
    ) {
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
        if (isArray(tagToAdd)) {
            tagToAdd = joinComma(tagToAdd);
        }
        return this.contactsTags.tagContact(this.selectedContacts, tagToAdd).then(() => {
            this.contacts.load(true);
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
