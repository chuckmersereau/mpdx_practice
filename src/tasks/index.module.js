import service from './tasks.service';
import tasks from './tasks.component';
import sort from './sort/sort.component';

export default angular.module('mpdx.tasks', [
    service,
    tasks,
    sort
]).name;
