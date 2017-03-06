import add from './add/add.controller';
import bulkEdit from './bulkEdit/bulkEdit.controller';
import complete from './complete/complete.controller';
import edit from './edit/edit.controller';
import filter from './filter/index.module';
import log from './log/log.controller';
import search from './search/search.component';
import service from './tasks.service';
import tasks from './tasks.component';
import tasksList from './list/list.component';

export default angular.module('mpdx.tasks', [
    add,
    bulkEdit,
    complete,
    edit,
    filter,
    log,
    search,
    service,
    tasks,
    tasksList
]).name;
