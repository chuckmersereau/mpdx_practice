import add from './add/add.controller';
import bulkEdit from './bulkEdit/bulkEdit.controller';
import edit from './edit/edit.controller';
import filter from './filter/index.module';
import search from './search/search.component';
import service from './tasks.service';
import tasks from './tasks.component';
import tasksList from './list/list.component';

export default angular.module('mpdx.tasks', [
    add,
    bulkEdit,
    edit,
    filter,
    search,
    service,
    tasks,
    tasksList
]).name;
