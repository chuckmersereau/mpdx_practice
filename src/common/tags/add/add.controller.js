class AddTagController {
    selectedContacts;
    contacts;
    contactsTags;
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
    addTag(tag) {
        const tagToAdd = tag || this.tags;
        if (!tagToAdd) {
            return;
        }
        this.contactsTags.tagContact(this.selectedContacts, tagToAdd).then(() => {
            this.contacts.load(true);
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
