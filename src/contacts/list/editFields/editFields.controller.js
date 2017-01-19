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
        this.constants = {};

        // this.serverConstants.fetchConstants(['bulk_update_options']);
        this.constants = this.serverConstants.data;
    }

    save() {
        return this.contacts.bulkEditFields(
            this.models,
            this.constants.bulk_update_options.pledge_currency,
            this.selectedContacts
        ).then(() => {
            this.$scope.$hide();
            this.contacts.load(true);
        });
    }
}

export default angular.module('mpdx.contacts.list.editFields.controller', [])
    .controller('editFieldsController', EditFieldsController).name;
