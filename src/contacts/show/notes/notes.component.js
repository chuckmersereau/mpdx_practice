import moment from 'moment';

class ContactNotesController {
    constructor(
        gettextCatalog,
        contacts
    ) {
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.moment = moment;
    }
    save() {
        const successMessage = this.gettextCatalog.getString('Changes saved successfully.');
        const errorMessage = this.gettextCatalog.getString('Unable to save changes.');
        return this.contacts.save(
            { id: this.contacts.current.id, notes: this.contacts.current.notes },
            successMessage,
            errorMessage
        );
    }
}

const Notes = {
    controller: ContactNotesController,
    template: require('./notes.html')
};

import contacts from 'contacts/contacts.service';
import gettext from 'angular-gettext';

export default angular.module('mpdx.contacts.show.notes.component', [
    gettext,
    contacts
]).component('contactNotes', Notes).name;
