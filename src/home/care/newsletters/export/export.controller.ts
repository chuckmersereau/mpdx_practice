import 'angular-block-ui';
import contacts, { ContactsService } from '../../../../contacts/contacts.service';

class ExportController {
    blockUI: IBlockUIService;
    emails: any;
    constructor(
        blockUI: IBlockUIService,
        private gettext: ng.gettext.gettextFunction,
        private contacts: ContactsService
    ) {
        this.blockUI = blockUI.instances.get('contact-export');

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

export default angular.module('mpdx.home.care.newsletter.export.controller', [
    'blockUI',
    contacts
]).controller('exportContactEmailsController', ExportController).name;
