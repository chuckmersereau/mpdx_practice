class AddTagController {
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
    addTag(tag) {
        const tagToAdd = tag || this.models.addTags.newTag;
        if (!tag) {
            return;
        }
        this.tagsService.tagContact(this.contacts, tagToAdd).then(() => {
            this.contactsService.load(true);
            this.tagsService.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
