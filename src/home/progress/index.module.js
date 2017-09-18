import appeals from './appeals/appeals.component';
import appointments from './appointments/appointments.component';
import component from './progress.component';
import contacts from './contacts/contacts.component';
import correspondence from './correspondence/correspondence.component';
import electronicContacts from './electronicContacts/electronicContacts.component';
import phoneDials from './phone/phone.component';

export default angular.module('mpdx.home.progress', [
    appeals,
    appointments,
    component,
    contacts,
    correspondence,
    electronicContacts,
    phoneDials
]).name;