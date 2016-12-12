class EditFieldsController {
    contacts;
    contactsService;
    serverConstants;
    tagsService;

    constructor(
        $scope,
        contactsTagsService, serverConstants, contactsService,
        contacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.contactsService = contactsService;
        this.serverConstants = serverConstants;
        this.tagsService = contactsTagsService;

        this.models = {};
        this.constants = {};

        this.activate();
    }
    activate() {
        this.serverConstants.fetchConstants(['bulk_update_options']);
        this.constants = this.serverConstants.data;
    }
    submit() {
        this.contactsService.bulkEditFields(
            this.models,
            this.constants.bulk_update_options.pledge_currency,
            this.contacts
        ).then(() => {
            this.$scope.$hide();
            this.contactsService.load(true);
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
