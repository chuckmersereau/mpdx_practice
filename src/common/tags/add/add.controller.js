class AddTagController {
    constructor(
        $scope,
        tags, contactsService,
        contacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.tags = tags;
        this.tags = '';
    }
    addTag(tag) {
        const tagToAdd = tag || this.tags;
        if (!tagToAdd) {
            return;
        }
        this.tags.tagContact(this.contacts, tagToAdd).then(() => {
            this.contactsService.load(true);
            this.tags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdxApp.common.tags.add.controller', [])
    .controller('addTagController', AddTagController).name;
