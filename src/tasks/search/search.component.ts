import tasks, { TasksService } from '../tasks.service';
import tasksFilter, { TasksFilterService } from '../filter/filter.service';

class TasksSearchController {
    constructor(
        private tasks: TasksService,
        private tasksFilter: TasksFilterService
    ) {
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
    }
}

const Search: ng.IComponentOptions = {
    controller: TasksSearchController,
    template: require('./search.html'),
    bindings: {}
};

export default angular.module('mpdx.common.tasks.search', [
    tasks, tasksFilter
]).component('tasksSearch', Search).name;
