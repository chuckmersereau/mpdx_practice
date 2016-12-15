class RemoveTagController {
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
    }
    removeTag(tag) {
        this.contactsTags.untagContact(this.contacts, tag).then(() => {
            this.contactsService.load(true);
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.common.tags.remove.controller', [])
    .controller('removeTagController', RemoveTagController).name;
