class RemoveTagController {
    contacts;
    contactsService;
    tagsService;

    constructor(
        $scope,
        tagsService, contactsService,
        contacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.tagsService = tagsService;
    }
    removeTag(tag) {
        this.tagsService.untagContact(this.contacts, tag).then(() => {
            this.contactsService.load(true);
            this.tagsService.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.common.tags.remove.controller', [])
    .controller('removeTagController', RemoveTagController).name;
