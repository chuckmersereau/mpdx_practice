class ContactNotesController {
    contactsService;

    constructor(
        contactsService
    ) {
        this.contactsService = contactsService;
        this.moment = moment;
    }
    save() {
        this.contactsService.save(this.contact);
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
