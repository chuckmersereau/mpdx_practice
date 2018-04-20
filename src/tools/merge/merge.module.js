import component from './merge.component';
import contacts from './contacts/contacts.module';
import people from './people/people.module';

export default angular.module('mpdx.tools.merge', [
    component,
    contacts,
    people
]).name;