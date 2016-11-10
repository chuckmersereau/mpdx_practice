import add from './add/add.controller';
import service from './tasks.service';
import tasks from './tasks.component';
import sort from './sort/sort.component';
import tasksList from './list/list.component';
import tags from './tags/index.module';

export default angular.module('mpdx.tasks', [
    add,
    service,
    tasks,
    sort,
    tasksList,
    tags
]).name;
