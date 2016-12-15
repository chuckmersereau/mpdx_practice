class ContactNotesController {
    contacts;

    constructor(
        contacts
    ) {
        this.contacts = contacts;
        this.moment = moment;
    }
    save() {
        this.contacts.save(this.contact);
    }
}

const Notes = {
    controller: ContactNotesController,
    template: require('./notes.html'),
    bindings: {
        contact: '='
    }
};

export default angular.module('mpdx.contacts.show.notes.component', [])
    .component('contactNotes', Notes).name;
