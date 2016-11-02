import service from './tasks.service';
import tasks from './tasks.component';
import sort from './sort/sort.component';
import tasksList from './list/list.component';
import tags from './tags/index.module';

export default angular.module('mpdx.tasks', [
    service,
    tasks,
    sort,
    tasksList,
    tags
]).name;
