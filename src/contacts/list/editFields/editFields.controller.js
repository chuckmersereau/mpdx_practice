class EditFieldsController {
    selectedContacts;
    contacts;
    serverConstants;
    tags;

    constructor(
        $scope,
        tags, serverConstants, contacts,
        selectedContacts
    ) {
        this.$scope = $scope;
        this.selectedContacts = selectedContacts;
        this.contacts = contacts;
        this.serverConstants = serverConstants;
        this.tags = tags;

        this.models = {};
        this.constants = {};

        this.activate();
    }
    activate() {
        this.serverConstants.fetchConstants(['bulk_update_options']);
        this.constants = this.serverConstants.data;
    }
    submit() {
        this.contacts.bulkEditFields(
            this.models,
            this.constants.bulk_update_options.pledge_currency,
            this.selectedContacts
        ).then(() => {
            this.$scope.$hide();
            this.contacts.load(true);
        });
    }
    isInvalid() {
        return !Object.keys(this.models).length;
    }
    reset() {
        this.models = {};
        angular.element('div.datetimepicker-wrapper td.hours input').val('');
        angular.element('div.datetimepicker-wrapper td.minutes input').val('');
    }
}

export default angular.module('mpdx.contacts.list.editFields.controller', [])
    .controller('editFieldsController', EditFieldsController).name;
