class AddTagController {
    contacts;
    contactsService;
    contactsTagsService;

    constructor(
        $scope,
        contactsTagsService, contactsService,
        contacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.tagsService = contactsTagsService;
    }
    addTag(tag) {
        const tagToAdd = tag || this.models.addTags.newTag;
        if (!tag) {
            return;
        }
        this.tagsService.addTag(this.contacts, tagToAdd).then(() => {
            this.contactsService.load(true);
            this.tagsService.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
