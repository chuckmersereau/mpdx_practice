class ContactNewModalController {
    contact;
    contacts;

    constructor(
        gettextCatalog, $scope, $state, contacts
    ) {
        this.$scope = $scope;
        this.$state = $state;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;

        this.contact = {name: ''};
    }
    save() {
        return this.contacts.create(this.contact).then((contact) => {
            if (contact) {
                this.$state.go('contact', { contactId: contact.id });
                this.$scope.$hide();
            } else {
                alert(this.gettextCatalog.getString('There was an error while trying to create the contact'));
            }
        });
    }
}

export default angular.module('mpdx.contacts.new.controller', [])
    .controller('contactNewModalController', ContactNewModalController).name;
