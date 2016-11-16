import component from './people.component';
import merge from './merge/merge.controller';
import modal from './modal/index.module';
import person from './person/person.component';

export default angular.module('mpdx.contacts.show.people', [
    component,
    merge,
    modal,
    person
]).name;