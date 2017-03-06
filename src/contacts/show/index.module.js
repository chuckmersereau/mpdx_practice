import address from './address/index.module';
import component from './show.component';
import details from './details/index.module';
import donations from './donations/index.module';
import history from './history/history.component';
import info from './info/info.component';
import notes from './notes/notes.component';
import people from './people/index.module';
import referrals from './referrals/index.module';
import tasks from './tasks/tasks.component';

export default angular.module('mpdx.contacts.show', [
    address,
    component,
    details,
    donations,
    history,
    info,
    notes,
    people,
    referrals,
    tasks
]).name;