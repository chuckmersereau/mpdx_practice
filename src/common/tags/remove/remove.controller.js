class RemoveTagController {
    contacts;
    contactsService;
    tags;

    constructor(
        $scope,
        tags, contactsService,
        contacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.tags = tags;
    }
    removeTag(tag) {
        this.tags.untagContact(this.contacts, tag).then(() => {
            this.contactsService.load(true);
            this.tags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.common.tags.remove.controller', [])
    .controller('removeTagController', RemoveTagController).name;
