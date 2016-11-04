import address from './address/address.component';
import component from './show.component';
import details from './details/index.module';
import donations from './donations/index.module';
import info from './info/info.component';
import people from './people/people.component';
import person from './person/person.component';
import personModal from './personModal/personModal.controller';
import tasks from './tasks/tasks.component';

export default angular.module('mpdx.contacts.show', [
    address,
    component,
    details,
    donations,
    info,
    people,
    person,
    personModal,
    tasks
]).name;