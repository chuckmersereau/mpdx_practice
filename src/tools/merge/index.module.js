import contacts from './contacts/index.module';
import people from './people/index.module';

export default angular.module('mpdx.tools.merge', [
    contacts,
    people
]).name;