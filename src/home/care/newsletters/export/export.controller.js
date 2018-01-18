class ExportController {
    constructor(
        blockUI, gettext,
        alerts, contacts
    ) {
        this.alerts = alerts;
        this.blockUI = blockUI.instances.get('contact-export');
        this.contacts = contacts;
        this.gettext = gettext;

        this.getEmails();
    }
    getEmails() {
        this.blockUI.start();
        return this.contacts.getEmails().then((data) => {
            this.emails = data;
            this.blockUI.reset();
        }).catch((ex) => {
            const msg = this.gettext('Unable to retrieve contacts. Please try again.');
            this.alerts.addAlert(msg, 'danger');
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
