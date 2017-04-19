import moment from 'moment';

class ContactNotesController {
    contacts;
    moment;

    constructor(
        gettextCatalog,
        alerts, contacts
    ) {
        this.alerts = alerts;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.moment = moment;
    }
    save() {
        return this.contacts.save({id: this.contacts.current.id, notes: this.contacts.current.notes}).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Changes saved successfully.'));
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'), 'danger');
        });
    }
}

const Notes = {
    controller: ContactNotesController,
    template: require('./notes.html')
};

export default angular.module('mpdx.contacts.show.notes.component', [])
    .component('contactNotes', Notes).name;
