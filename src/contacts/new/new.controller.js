class ContactNewModalController {
    contact;
    contactsService;

    constructor(
        gettextCatalog, $scope, $state, contactsService
    ) {
        this.$scope = $scope;
        this.$state = $state;
        this.contactsService = contactsService;
        this.gettextCatalog = gettextCatalog;

        this.contact = {name: ''};
    }
    save() {
        this.contactsService.create(this.contact).then((data) => {
            if (data.contact) {
                this.$state.go('contact', { contactId: data.contact.id });
                this.$scope.$hide();
            } else {
                alert(this.gettextCatalog.getString('There was an error while trying to create the contact'));
            }
        });
    }
}

export default angular.module('mpdx.contacts.new.controller', [])
    .controller('contactNewModalController', ContactNewModalController).name;
