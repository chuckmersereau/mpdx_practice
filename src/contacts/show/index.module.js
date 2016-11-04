import address from './address/address.component';
import completeTask from './completeTask/completeTask.controller';
import component from './show.component';
import details from './details/index.module';
import donations from './donations/index.module';
import history from './history/history.component';
import info from './info/info.component';
import people from './people/people.component';
import person from './person/person.component';
import personModal from './personModal/personModal.controller';
import referrals from './referrals/index.module';
import tasks from './tasks/tasks.component';

export default angular.module('mpdx.contacts.show', [
    address,
    completeTask,
    component,
    details,
    donations,
    history,
    info,
    people,
    person,
    personModal,
    referrals,
    tasks
]).name;