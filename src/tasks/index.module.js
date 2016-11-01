import service from './tasks.service';
import tasks from './tasks.component';
import sort from './sort/sort.component';
import tasksList from './list/list.component';

export default angular.module('mpdx.tasks', [
    service,
    tasks,
    sort,
    tasksList
]).name;
