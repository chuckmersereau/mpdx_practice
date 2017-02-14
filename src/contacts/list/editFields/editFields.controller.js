class EditFieldsController {
    selectedContacts;
    contacts;
    serverConstants;
    contactsTags;

    constructor(
        $scope,
        contactsTags, serverConstants, contacts,
        selectedContacts
    ) {
        this.$scope = $scope;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.contactsTags = contactsTags;

        this.models = {};
    }

    save() {
        return this.contacts.bulkEditFields(
            this.models,
            this.constants.currencies,
            this.selectedContacts
        ).then(() => {
            this.$scope.$hide();
            this.contacts.load(true);
        });
    }
}

export default angular.module('mpdx.contacts.list.editFields.controller', [])
    .controller('editFieldsController', EditFieldsController).name;
