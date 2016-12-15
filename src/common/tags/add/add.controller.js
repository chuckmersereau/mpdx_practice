class AddTagController {
    contacts;
    contactsService;
    contactsTags;
    constructor(
        $scope,
        contactsTags, contactsService,
        contacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.contactsTags = contactsTags;
        this.tags = '';
    }
    addTag(tag) {
        const tagToAdd = tag || this.tags;
        if (!tagToAdd) {
            return;
        }
        this.contactsTags.tagContact(this.contacts, tagToAdd).then(() => {
            this.contactsService.load(true);
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
