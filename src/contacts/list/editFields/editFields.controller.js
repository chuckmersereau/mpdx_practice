class EditFieldsController {
    selectedContacts;
    contacts;
    locale;
    serverConstants;
    contactsTags;

    constructor(
        $rootScope, $scope,
        contactsTags, locale, serverConstants, contacts,
        selectedContacts
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.locale = locale;
        this.serverConstants = serverConstants;

        this.models = {};
    }

    save() {
        return this.contacts.bulkEditFields(
            this.models,
            this.selectedContacts
        ).then(() => {
            this.$scope.$hide();
            this.$rootScope.$emit('contactCreated');
        });
    }
}

export default angular.module('mpdx.contacts.list.editFields.controller', [])
    .controller('editFieldsController', EditFieldsController).name;
