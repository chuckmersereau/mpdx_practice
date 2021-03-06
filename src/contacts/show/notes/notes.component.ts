import 'angular-gettext';
import * as moment from 'moment';
import contacts, { ContactsService } from '../../contacts.service';

class ContactNotesController {
    moment: any;
    constructor(
        private gettextCatalog: ng.gettext.gettextCatalog,
        private contacts: ContactsService
    ) {
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

export default angular.module('mpdx.contacts.show.notes.component', [
    'gettext',
    contacts
]).component('contactNotes', Notes).name;
