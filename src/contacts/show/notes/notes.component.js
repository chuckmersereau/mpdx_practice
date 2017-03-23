import moment from 'moment';

class ContactNotesController {
    contacts;
    moment;

    constructor(
        contacts
    ) {
        this.contacts = contacts;
        this.moment = moment;
    }
    save() {
        this.onSave();
    }
}

const Notes = {
    controller: ContactNotesController,
    template: require('./notes.html'),
    bindings: {
        contact: '=',
        onSave: '&'
    }
};

export default angular.module('mpdx.contacts.show.notes.component', [])
    .component('contactNotes', Notes).name;
