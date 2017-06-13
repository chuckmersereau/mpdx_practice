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
        }).catch(err => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'), 'danger');
            throw err;
        });
    }
}

const Notes = {
    controller: ContactNotesController,
    template: require('./notes.html')
};

import alerts from 'common/alerts/alerts.service';
import contacts from 'contacts/contacts.service';
import gettext from 'angular-gettext';

export default angular.module('mpdx.contacts.show.notes.component', [
    gettext,
    alerts, contacts
]).component('contactNotes', Notes).name;
