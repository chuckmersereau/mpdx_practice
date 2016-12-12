class RemoveTagController {
    contacts;
    selectedContacts;
    tags;

    constructor(
        $scope,
        tags, contacts,
        selectedContacts
    ) {
        this.$scope = $scope;
        this.contacts = selectedContacts;
        this.contacts = contacts;
        this.tags = tags;
    }
    removeTag(tag) {
        this.tags.untagContact(this.contacts, tag).then(() => {
            this.contacts.load(true);
            this.tags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.common.tags.remove.controller', [])
    .controller('removeTagController', RemoveTagController).name;
