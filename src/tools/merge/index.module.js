import component from './merge.component';
import contacts from './contacts/index.module';
import people from './people/index.module';

export default angular.module('mpdx.tools.merge', [
    component,
    contacts,
    people
]).name;