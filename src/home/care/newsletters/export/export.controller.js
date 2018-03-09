class ExportController {
    constructor(
        blockUI, gettext,
        contacts
    ) {
        this.blockUI = blockUI.instances.get('contact-export');
        this.contacts = contacts;
        this.gettext = gettext;

        this.getEmails();
    }
    getEmails() {
        this.blockUI.start();
        const errorMessage = this.gettext('Unable to retrieve contacts. Please try again.');
        return this.contacts.getEmails(errorMessage).then((data) => {
            this.emails = data;
            this.blockUI.reset();
        }).catch((ex) => {
            this.blockUI.reset();
            throw ex;
        });
    }
}

import blockUI from 'angular-block-ui';
import contacts from 'contacts/contacts.service';

export default angular.module('mpdx.home.care.newsletter.export.controller', [
    blockUI,
    contacts
]).controller('exportContactEmailsController', ExportController).name;
