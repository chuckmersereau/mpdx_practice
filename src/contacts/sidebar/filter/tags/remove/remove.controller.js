class RemoveTagController {
    selectedContacts;
    contacts;
    contactsTags;

    constructor(
        $rootScope, $scope,
        contactsTags, contacts,
        selectedContacts
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
    }
    removeTag(tag) {
        this.contactsTags.untagContact(this.selectedContacts, tag).then(() => {
            this.$rootScope.$emit('contactCreated');
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.common.tags.remove.controller', [])
    .controller('removeTagController', RemoveTagController).name;
