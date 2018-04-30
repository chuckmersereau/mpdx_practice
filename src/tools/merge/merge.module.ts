import contacts from './contacts/contacts.module';
import people from './people/people.module';

export default angular.module('mpdx.tools.merge', [
    contacts,
    people
]).name;