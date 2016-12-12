class AddTagController {
    contacts;
    tags;
    selectedContacts;

    constructor(
        $scope,
        tags, contacts,
        selectedContacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.selectedContacts = selectedContacts;
        this.tags = tags;
        this.newTags = '';
    }
    addTag(tag) {
        const tagToAdd = tag || this.newTags;
        if (!tagToAdd) {
            return;
        }
        this.tags.tagContact(this.selectedContacts, tagToAdd).then(() => {
            this.contacts.load(true);
            this.tags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
