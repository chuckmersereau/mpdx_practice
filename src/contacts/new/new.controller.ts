class ContactNewModalController {
    contact: any;
    constructor(
        private gettextCatalog: ng.gettext.gettextCatalog,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private $state: StateService,
        private contacts: ContactsService
    ) {
        this.contact = { name: '' };
    }
    save() {
        return this.contacts.create(this.contact).then((contact: any) => {
            if (contact) {
                this.$state.go('contacts.show', { contactId: contact.id });
                this.$scope.$hide();
            } else {
                alert(this.gettextCatalog.getString('There was an error while trying to create the contact'));
            }
        });
    }
}

import { StateService } from '@uirouter/core';
import contacts, { ContactsService } from '../contacts.service';

export default angular.module('mpdx.contacts.new.controller', [
    contacts
]).controller('contactNewModalController', ContactNewModalController).name;
